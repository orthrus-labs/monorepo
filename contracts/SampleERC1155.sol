// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract SampleERC1155 is ERC1155Burnable, Ownable{

    address marketplaceAddress;

    constructor(string memory _uri)
        ERC1155(_uri)
    {}

    function setMarketplaceAddress(address _marketplaceAddress) public onlyOwner{
        marketplaceAddress = _marketplaceAddress;

    }

    modifier onlyMarketplace{
        require(msg.sender == marketplaceAddress, "Only the marketplace can call this function");
        _;
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyMarketplace
    {
        _mint(account, id, amount, data);
    }

}