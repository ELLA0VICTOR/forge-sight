import { createPublicClient, http } from "viem";
import type { NetworkConfig } from "../types.js";

export function createForkPublicClient(config: NetworkConfig) {
  return createPublicClient({
    chain: {
      id: config.chainId,
      name: config.name,
      nativeCurrency: {
        name: config.nativeCurrency,
        symbol: config.nativeCurrency,
        decimals: 18,
      },
      rpcUrls: {
        default: { http: [config.rpcUrl] },
      },
    },
    transport: http(config.rpcUrl),
  });
}
