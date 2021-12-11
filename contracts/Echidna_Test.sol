// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './Marketplace.sol';

contract Test is Marketplace {
  constructor() Marketplace(20, 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707, 0x5FbDB2315678afecb367f032d93F642f64180aa3, 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512) { }

  function echidna_test_balance() public returns (bool) {
    return curationFee = 20;
  }
}