// SPDX-License-Identifier: Unlicense
// Copyright 2021, Riccardo Persiani, All rights reserved.

// @author Riccardo Persiani <r.persiani92@gmail.com>

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title The Nifty Lair Marketplace
/// @notice Manage NFT Marketplace
contract Marketplace {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private itemIds;
    Counters.Counter private itemSold;
    Counters.Counter private userIds;

    uint256 private curationFee;

    struct listedNFT {
        uint256 id;
        address contractAddress;
        uint256 tokenId;
        string metadataUri;
        address payable seller; // The seller = the current owner of the NFT
        address payable owner; // The future NFT owner: set to 0 when NFT listed initially because the new owner is not known yet.
        uint256 price; // Defined by the seller.
    }

    struct bondedNFT {
        uint256 tokenId;
        uint256 amount;
        address user;
        bool isBond;
        uint256 userId;
        address erc20Address;
    }

    mapping(uint256 => listedNFT) marketBasket;
    mapping(uint256 => mapping (uint256 => bondedNFT)) boundMap;

    event NFTListed(
        uint256 indexed _marketItemId,
        address indexed _contractAddress,
        uint256 indexed _tokenId,
        address _seller,
        address _newOwner,
        uint256 _price
    );

    event NFTBought(
        uint256 indexed _marketItemId,
        address indexed _contractAddress,
        uint256 indexed _tokenId,
        address _seller,
        address _newOwner,
        uint256 _price
    );



    constructor(uint256 _curationFee) {
        console.log("Deploying a Marketplace with curation fee:", _curationFee);
        curationFee = _curationFee;
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
        // Approve the marketplace contract to transfer the nft.
        IERC721(_contractAddress).approve(address(this), _tokenId);
        emit NFTListed(
            marketItemId,
            _contractAddress,
            _tokenId,
            msg.sender,
            address(0),
            _price
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
        _seller.transfer(_price);
        emit NFTBought(
            marketItemId,
            _contractAddress,
            _tokenId,
            _seller,
            msg.sender,
            _price
        );
    }

    function bondNFT(uint256 marketItemId, uint256 amount, address erc20Address) external {
        require(amount > 0, "Amount must be higher than 0");
        require(IERC20(erc20Address).balanceOf(msg.sender) >= amount, "Balance must be at least equal to the amount");
        address _contractAddress = marketBasket[marketItemId].contractAddress; 
        userIds.increment();
        uint256 userId = userIds.current();
        IERC20(erc20Address).transferFrom(msg.sender, _contractAddress, amount);
        boundMap[marketItemId][userId].amount = amount;
        boundMap[marketItemId][userId].user = msg.sender;
        boundMap[marketItemId][userId].isBond = true;
        boundMap[marketItemId][userId].tokenId = marketBasket[marketItemId].tokenId;
        boundMap[marketItemId][userId].userId = userId;
        boundMap[marketItemId][userId].erc20Address = erc20Address;
    }

    function unbondNFT(uint marketItemId, uint256 userId) external{
        require(boundMap[marketItemId][userId].isBond == true, "User is not bound");
        address _contractAddress = marketBasket[marketItemId].contractAddress;
        uint256 amount = boundMap[marketItemId][userId].amount;
        IERC20(boundMap[marketItemId][userId].erc20Address).transferFrom(_contractAddress, msg.sender, amount);
        boundMap[marketItemId][userId].isBond = false;
    }
}
