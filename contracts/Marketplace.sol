// SPDX-License-Identifier: Unlicense
// Copyright 2021, Riccardo Persiani, All rights reserved.

// @author Riccardo Persiani <r.persiani92@gmail.com>

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IERC1155.sol";
import "./interface/Math.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

/// @title The Nifty Lair Marketplace
/// @notice Manage NFT Marketplace
 contract Marketplace is Ownable, Math, ChainlinkClient{
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using Chainlink for Chainlink.Request;

    Counters.Counter private itemIds;
    Counters.Counter private itemSold;
    //Counters.Counter private userIds;

    uint256 private curationFee;
    address public erc1155Address;
    string public amountStr;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    string private str1;
    string private str2;
    address private account;
    uint256 private marketItemIdGlobal;

    struct listedNFT {
        uint256 id;
        address contractAddress;
        uint256 tokenId;
        string metadataUri;
        address payable seller; // The seller = the current owner of the NFT
        address payable owner; // The future NFT owner: set to 0 when NFT listed initially because the new owner is not known yet.
        uint256 price; // Defined by the seller.
        uint256 timestampNFT;
        uint256 totalVotingPower;
        uint256 tokenValue;
    }

    struct bondedNFT {
        uint256 tokenId;
        uint256 amount;
        address user;
        bool isBond;
        uint256 timeStamp;
        address erc20Address;
        uint256 votingPower;
    }

    mapping(uint256 => listedNFT) marketBasket;
    mapping(uint256 => mapping(address => bondedNFT)) boundMap;

    event NFTListed(
        uint256 indexed _marketItemId,
        address indexed _contractAddress,
        uint256 indexed _tokenId,
        address _seller,
        address _newOwner,
        uint256 _price,
        uint256 _timestampNFT
    );

    event NFTBought(
        uint256 indexed _marketItemId,
        address indexed _contractAddress,
        uint256 indexed _tokenId,
        address _seller,
        address _newOwner,
        uint256 _price
    );

    event NFTBond(
        uint256 indexed _marketItemId,
        uint256 indexed _tokenId,
        uint256 _amount,
        uint256 _timestamp,
        address _erc20Address,
        bool _isBond,
        address _user
    );

    event NFTUnbond(
        uint256 indexed _marketItemId,
        uint256 indexed _tokenId,
        uint256 _amount,
        uint256 _timestamp,
        address _erc20Address,
        bool _isBond,
        address _user
    );

    event VotingPower(
        uint256 _votingPower
    );


    constructor(uint256 _curationFee, address _erc1155Address, address _linkToken) {
        console.log("Deploying a Marketplace with curation fee:", _curationFee);
        curationFee = _curationFee;
        erc1155Address = _erc1155Address;
        setChainlinkToken(_linkToken);
        oracle = 0x0bDDCD124709aCBf9BB3F824EbC61C87019888bb;
        jobId = "2bb15c3f9cfc4336b95012872ff05092";
        fee = 0.01 * 10 ** 18; // (Varies by network and job)
        str1 = "https://api.mathjs.org/v4/?expr=";
        str2 = "^(1/8)";
    }

    // @notice List the NFT on marketplace.
    // @param _contractAddress erc721 contract address.
    // @param _tokenId id of the erc721.
    // @param _metadataUri uri of the nft.
    // @param _price sale price set by the nft owner.
    function listNFT(
        address _contractAddress,
        uint256 _tokenId,
        string memory _metadataUri,
        uint256 _price
    ) external {
        require(_price > 0, "Price must be higher than 0");
        require(IERC721(_contractAddress).ownerOf(_tokenId) == msg.sender, "Only the owner can list the NFT");
        // Increment the counter due to new item listed.
        itemIds.increment();
        // Get the latest id.
        uint256 marketItemId = itemIds.current();
        // Save the nft info into the market basket.
        marketBasket[marketItemId].id = marketItemId;
        marketBasket[marketItemId].contractAddress = _contractAddress;
        marketBasket[marketItemId].tokenId = _tokenId;
        marketBasket[marketItemId].seller = payable(msg.sender);
        marketBasket[marketItemId].owner = payable(address(0));
        marketBasket[marketItemId].price = _price;
        marketBasket[marketItemId].metadataUri = _metadataUri;
        marketBasket[marketItemId].timestampNFT = block.timestamp;
        marketBasket[marketItemId].totalVotingPower = 1;
        // Approve the marketplace contract to transfer the nft.
        //IERC721(_contractAddress).setApprovalForAll(address(this), true);
        emit NFTListed(
            marketItemId,
            _contractAddress,
            _tokenId,
            msg.sender,
            address(0),
            _price,
            marketBasket[marketItemId].timestampNFT
        );
    }

    function getCurationFee() public view returns (uint256) {
        return curationFee;
    }

    function buyNFT(uint256 marketItemId) external payable {
        uint256 _price = marketBasket[marketItemId].price;
        uint256 _tokenId = marketBasket[marketItemId].tokenId;
        address payable _seller = marketBasket[marketItemId].seller;
        address _contractAddress = marketBasket[marketItemId].contractAddress;
        require(msg.value == _price, "Value must match the price");
        marketBasket[marketItemId].owner = payable(msg.sender);
        IERC721(_contractAddress).transferFrom(_seller, msg.sender, _tokenId);
        _seller.transfer(_price - (_price / 100));
        marketBasket[marketItemId].tokenValue = (_price / 100) / (marketBasket[marketItemId].totalVotingPower);
        emit NFTBought(
            marketItemId,
            _contractAddress,
            _tokenId,
            _seller,
            msg.sender,
            _price
        );
    }

    function bondNFT(
        uint256 marketItemId,
        uint256 amount,
        address erc20Address
    ) external {
        require(amount > 0, "Amount must be higher than 0");
        require(IERC20(erc20Address).balanceOf(msg.sender) >= amount, "Balance must be at least equal to the amount");
        require(boundMap[marketItemId][msg.sender].isBond == false, "User is already bonded");
        require(marketBasket[marketItemId].owner == address(0), "The NFT has been already bought");
        IERC20(erc20Address).transferFrom(msg.sender, address(this), amount);
        boundMap[marketItemId][msg.sender].amount = amount;
        boundMap[marketItemId][msg.sender].user = msg.sender;
        boundMap[marketItemId][msg.sender].isBond = true;
        boundMap[marketItemId][msg.sender].tokenId = marketBasket[marketItemId].tokenId;
        boundMap[marketItemId][msg.sender].erc20Address = erc20Address;
        boundMap[marketItemId][msg.sender].timeStamp =  block.timestamp;
        account = msg.sender;
        marketItemIdGlobal = marketItemId;
        uint256 timeStamp = boundMap[marketItemId][msg.sender].timeStamp - marketBasket[marketItemId].timestampNFT;
        eighthRoot(timeStamp);
        emit NFTBond(
            marketItemId,
            marketBasket[marketItemId].tokenId,
            amount,
            block.timestamp,
            erc20Address,
            true,
            msg.sender
        );
    }

    function unbondNFT(uint256 marketItemId) external {
        require(boundMap[marketItemId][msg.sender].isBond == true, "User is not bond" );
        require(IERC1155(erc1155Address).balanceOf(msg.sender, marketBasket[marketItemId].tokenId) == boundMap[marketItemId][msg.sender].votingPower);
        uint256 amount = boundMap[marketItemId][msg.sender].amount;
        IERC20(boundMap[marketItemId][msg.sender].erc20Address).transferFrom(
            address(this),
            msg.sender,
            amount
        );
        boundMap[marketItemId][msg.sender].isBond = false;
        IERC1155(erc1155Address).burn(msg.sender, marketItemId, boundMap[marketItemId][msg.sender].votingPower);
        marketBasket[marketItemId].totalVotingPower = marketBasket[marketItemId].totalVotingPower - boundMap[marketItemId][msg.sender].votingPower;
        emit NFTUnbond(
            marketItemId,
            marketBasket[marketItemId].tokenId,
            amount,
            block.timestamp,
            boundMap[marketItemId][msg.sender].erc20Address,
            false,
            msg.sender
        );
    }

    function claimReward(uint256 marketItemId) public{
        require(boundMap[marketItemId][msg.sender].isBond == true, "User is not bond");
        require(marketBasket[marketItemId].owner != address(0));
        uint256 reward = boundMap[marketItemId][msg.sender].votingPower * marketBasket[marketItemId].tokenValue;
        address payable rewarded = payable(msg.sender);
        IERC1155(erc1155Address).burn(msg.sender, marketItemId, boundMap[marketItemId][msg.sender].votingPower);
        IERC20(boundMap[marketItemId][msg.sender].erc20Address).transferFrom(address(this), msg.sender, boundMap[marketItemId][msg.sender].amount);
        rewarded.transfer(reward);
        
    }

    function eighthRoot(uint256 _amount) public returns (bytes32 requestId) 
    {
        amountStr = uint2str(_amount);   
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);   
        // Set the URL to perform the GET request on
        request.add("get", string(abi.encodePacked(str1, amountStr, str2)));                
        // Multiply the result by 1000000000000000000 to remove decimals
        int timesAmount = 10**18;
        request.addInt("times", timesAmount);   
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        uint256 votingPower = nthRoot(boundMap[marketItemIdGlobal][account].amount, 2, 18, 10) / (_volume / 100);
        boundMap[marketItemIdGlobal][account].votingPower = votingPower;
        IERC1155(erc1155Address).mint(account, marketItemIdGlobal, boundMap[marketItemIdGlobal][account].votingPower, "0x00"); 
        marketBasket[marketItemIdGlobal].totalVotingPower = marketBasket[marketItemIdGlobal].totalVotingPower + boundMap[marketItemIdGlobal][account].votingPower;
        emit VotingPower(
            votingPower
        );
    }
    
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
