import type { Address, ContractLabel, NetworkConfig } from "./types.js";

export const DEFAULT_FORK_BLOCK = Number(process.env.FORK_BLOCK ?? 23559136);

export const networkConfig: NetworkConfig = {
  name: process.env.PHAROS_NETWORK_NAME ?? "atlantic-testnet",
  chainId: Number(process.env.PHAROS_CHAIN_ID ?? 688689),
  rpcUrl: process.env.PHAROS_RPC_URL ?? "https://atlantic.dplabs-internal.com",
  wsUrl: process.env.PHAROS_WS_URL ?? "wss://atlantic.dplabs-internal.com",
  nativeCurrency: process.env.PHAROS_NATIVE_SYMBOL ?? "PHRS",
  explorerUrl: process.env.PHAROS_EXPLORER_URL ?? "https://atlantic.pharosscan.xyz/",
  explorerApiUrl:
    process.env.PHAROS_EXPLORER_API ??
    "https://api.socialscan.io/pharos-atlantic-testnet",
  explorerVerifyApiUrl:
    process.env.PHAROS_EXPLORER_VERIFY_API ??
    "https://api.socialscan.io/pharos-atlantic-testnet/v1/explorer/command_api/contract",
  forkBlock: DEFAULT_FORK_BLOCK,
};

function envAddress(name: string, fallback: Address): Address {
  return (process.env[name] ?? fallback) as Address;
}

export const demoAddresses = {
  agent: envAddress("DEMO_AGENT_ADDRESS", "0xa1b2000000000000000000000000000000000001"),
  router: envAddress("ADDR_ROUTER", "0x00000000000000000000000000000000f0e51001"),
  moon: envAddress("ADDR_MOON", "0x00000000000000000000000000000000f0e51002"),
  owner: envAddress("DEMO_OWNER_ADDRESS", "0x00000000000000000000000000000000f0e51003"),
  fresh: envAddress("DEMO_FRESH_ADDRESS", "0x00000000000000000000000000000000f0e51004"),
  usdc: envAddress("ADDR_USDC", "0xE0BE08c77f415F577A1B3A9aD7a1Df1479564ec8"),
  wphrs: envAddress("ADDR_WPHRS", "0x838800b758277CC111B2d48Ab01e5E164f8E9471"),
  probe: envAddress("ADDR_PROBE", "0x00000000000000000000000000000000f0e51005"),
} as const satisfies Record<string, Address>;

export const contractLabels: Record<Address, ContractLabel> = {
  [demoAddresses.router]: {
    address: demoAddresses.router,
    name: "SimpleRouter",
    verified: true,
    deployedBlock: 23550000,
  },
  [demoAddresses.usdc]: {
    address: demoAddresses.usdc,
    name: "USDC",
    verified: true,
    deployedBlock: 23540000,
  },
  [demoAddresses.wphrs]: {
    address: demoAddresses.wphrs,
    name: "WPHRS",
    verified: true,
    deployedBlock: 23540000,
  },
  [demoAddresses.moon]: {
    address: demoAddresses.moon,
    name: "MoonToken",
    verified: false,
    deployedBlock: 23559002,
  },
  [demoAddresses.probe]: {
    address: demoAddresses.probe,
    name: "RoundTripProbe",
    verified: true,
    deployedBlock: 23559002,
  },
};

export function labelFor(address: Address): ContractLabel {
  return (
    contractLabels[address] ?? {
      address,
      name: "UnknownContract",
      verified: false,
    }
  );
}
