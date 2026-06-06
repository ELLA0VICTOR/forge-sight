// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IProbeToken {
    function mint(address to, uint256 amount) external;
    function transfer(address to, uint256 amount) external returns (bool);
}

contract RoundTripProbe {
    function probe(address token, uint256 amount) external returns (bool) {
        IProbeToken(token).mint(address(this), amount);
        return IProbeToken(token).transfer(msg.sender, amount);
    }
}
