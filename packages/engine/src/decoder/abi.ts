import type { Abi } from "viem";
import type { Address } from "../types.js";
import { demoAddresses, labelFor } from "../config.js";

export const simpleRouterAbi = [
  {
    type: "function",
    name: "swap",
    stateMutability: "payable",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "minOut", type: "uint256" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
  {
    type: "error",
    name: "InsufficientOutputAmount",
    inputs: [
      { name: "minOut", type: "uint256" },
      { name: "actualOut", type: "uint256" },
    ],
  },
] as const satisfies Abi;

export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "ok", type: "bool" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "ok", type: "bool" }],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const satisfies Abi;

export const honeypotAbi = [
  ...erc20Abi,
  {
    type: "error",
    name: "SellBlocked",
    inputs: [{ name: "seller", type: "address" }],
  },
] as const satisfies Abi;

export const roundTripProbeAbi = [
  {
    type: "function",
    name: "probe",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "ok", type: "bool" }],
  },
] as const satisfies Abi;

export function resolveAbi(address: Address): { abi: Abi; verified: boolean; contractName: string } {
  const label = labelFor(address);

  if (address === demoAddresses.router) {
    return { abi: simpleRouterAbi, verified: label.verified, contractName: label.name };
  }

  if (address === demoAddresses.moon) {
    return { abi: honeypotAbi, verified: label.verified, contractName: label.name };
  }

  return { abi: erc20Abi, verified: label.verified, contractName: label.name };
}

export function symbolFor(address: Address | "native"): string {
  if (address === "native") return "PHRS";
  if (address === demoAddresses.usdc) return "USDC";
  if (address === demoAddresses.wphrs) return "WPHRS";
  if (address === demoAddresses.moon) return "MOON";
  return labelFor(address).name;
}
