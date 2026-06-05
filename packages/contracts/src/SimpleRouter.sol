// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMintable {
    function mint(address to, uint256 amount) external;
}

contract SimpleRouter {
    error InsufficientOutputAmount(uint256 minOut, uint256 actualOut);

    uint256 public constant USDC_TO_WPHRS_RATE = 995; // 100 USDC -> 99.5 WPHRS
    uint256 public constant RATE_DENOMINATOR = 1000;

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minOut
    ) external payable returns (uint256 amountOut) {
        if (msg.value > 0) {
            amountOut = msg.value * 980;
        } else {
            IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
            amountOut = (amountIn * 1e12 * USDC_TO_WPHRS_RATE) / RATE_DENOMINATOR;
        }

        if (amountOut < minOut) {
            revert InsufficientOutputAmount(minOut, amountOut);
        }

        IMintable(tokenOut).mint(msg.sender, amountOut);
    }
}
