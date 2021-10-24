// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title ERC-721 (NFT) minting contract
/// @notice This contract is used for generating ERC-721 NFTs for testing purposes only.
contract SampleERC721 is ERC721 {
    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    /// @dev Public function for minting a NFT
    /// @param _to The address of the new NFT owner
    /// @param _tokenId The NFT identifier
    function mintToken(address _to, uint256 _tokenId) public {
        _safeMint(_to, _tokenId);
        require(_exists(_tokenId));
    }
}
