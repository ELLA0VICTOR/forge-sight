// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HoneypotToken is ERC20 {
    error SellBlocked(address seller);

    address public immutable owner;
    mapping(address => bool) public trapped;

    constructor() ERC20("Moon Token", "MOON") {
        owner = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        trapped[to] = true;
        _mint(to, amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        if (msg.sender != owner && trapped[msg.sender]) {
            revert SellBlocked(msg.sender);
        }
        return super.transfer(to, amount);
    }
}
