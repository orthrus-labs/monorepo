// SPDX-License-Identifier: Unlicense
// Copyright 2021, Riccardo Persiani, All rights reserved.

// @author Riccardo Persiani <r.persiani92@gmail.com>

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @title The Nifty Lair Marketplace
/// @notice Manage NFT Marketplace
contract Marketplace {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private itemIds;
    Counters.Counter private itemSold;

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

    mapping(uint256 => listedNFT) marketBasket;

    event NFTListed(
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
}
