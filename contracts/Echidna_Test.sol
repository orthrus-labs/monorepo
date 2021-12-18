// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './Marketplace.sol';

contract Test is Marketplace {

  address public echidnaDeployer = address(0x1);
  address public echidnaSender = address(0x2);

  constructor() Marketplace(20, 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707, 0x5FbDB2315678afecb367f032d93F642f64180aa3, 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512) {
   }

  function echidna_test_Owner() external returns (bool) {
    return owner() == echidnaDeployer;
  }

  function echidna_test_erc1155Address() external returns (bool) {
    return erc1155Address == 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707;
  }

  function echidna_test_curationFee() external returns (bool) {
    return getCurationFee() == 20;
  }
}