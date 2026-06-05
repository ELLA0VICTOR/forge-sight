// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {HoneypotToken} from "../src/HoneypotToken.sol";
import {SimpleRouter} from "../src/SimpleRouter.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        MockERC20 usdc = new MockERC20("USD Coin", "USDC", 6);
        MockERC20 wphrs = new MockERC20("Wrapped PHRS", "WPHRS", 18);
        HoneypotToken moon = new HoneypotToken();
        SimpleRouter router = new SimpleRouter();

        usdc.mint(msg.sender, 1_000_000e6);
        wphrs.mint(address(router), 1_000_000e18);
        moon.mint(address(router), 1_000_000e18);

        vm.stopBroadcast();
    }
}
