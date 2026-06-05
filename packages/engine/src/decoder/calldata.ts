import { decodeFunctionData, formatUnits, maxUint256 } from "viem";
import type { Address, DecodedCall, Hex } from "../types.js";
import { demoAddresses, labelFor } from "../config.js";
import { resolveAbi, symbolFor } from "./abi.js";

function toAddress(value: unknown): Address {
  if (typeof value !== "string" || !value.startsWith("0x")) {
    throw new Error("Expected address-like argument");
  }
  return value as Address;
}

function toBigIntString(value: unknown): string {
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  throw new Error("Expected bigint-like argument");
}

function amountLabel(token: Address, raw: string): string {
  const decimals = token === demoAddresses.usdc ? 6 : 18;
  const formatted = formatUnits(BigInt(raw), decimals);
  return `${formatted} ${symbolFor(token)}`;
}

export function decodeCalldata(input: { to: Address; data: Hex }): DecodedCall {
  const resolved = resolveAbi(input.to);

  try {
    const decoded = decodeFunctionData({
      abi: resolved.abi,
      data: input.data,
    });

    if (decoded.functionName === "swap") {
      const [tokenInRaw, tokenOutRaw, amountInRaw, minOutRaw] = decoded.args ?? [];
      const tokenIn = toAddress(tokenInRaw);
      const tokenOut = toAddress(tokenOutRaw);
      const amountIn = toBigIntString(amountInRaw);
      const minOut = toBigIntString(minOutRaw);

      return {
        to: input.to,
        contractName: resolved.contractName,
        functionName: "swap",
        verified: resolved.verified,
        humanReadable: `swap ${amountLabel(tokenIn, amountIn)} to ${symbolFor(tokenOut)} with minOut ${amountLabel(tokenOut, minOut)}`,
        args: {
          tokenIn,
          tokenOut,
          amountIn,
          minOut,
        },
      };
    }

    if (decoded.functionName === "approve") {
      const [spenderRaw, amountRaw] = decoded.args ?? [];
      const spender = toAddress(spenderRaw);
      const amount = toBigIntString(amountRaw);
      const unlimited = BigInt(amount) === maxUint256;
      const token = labelFor(input.to).name;

      return {
        to: input.to,
        contractName: token,
        functionName: "approve",
        verified: resolved.verified,
        humanReadable: unlimited
          ? `approve unlimited ${token} allowance to ${spender}`
          : `approve ${amount} ${token} allowance to ${spender}`,
        args: {
          spender,
          amount,
          unlimited: String(unlimited),
        },
      };
    }

    return {
      to: input.to,
      contractName: resolved.contractName,
      functionName: String(decoded.functionName),
      verified: resolved.verified,
      humanReadable: `${resolved.contractName}.${String(decoded.functionName)}(...)`,
      args: {},
    };
  } catch {
    return {
      to: input.to,
      contractName: resolved.contractName,
      functionName: "unknown",
      verified: resolved.verified,
      humanReadable: `unknown call to ${resolved.contractName}`,
      args: {},
    };
  }
}

export function explainCalldata(input: { to: Address; data: Hex }): DecodedCall {
  return decodeCalldata(input);
}
