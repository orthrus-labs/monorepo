// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";



contract SampleERC1155 is ERC1155Burnable{

    constructor(string memory _uri)
        ERC1155(_uri)
    {}
}