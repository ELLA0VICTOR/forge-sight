export const pharosAtlantic = {
  name: "atlantic-testnet",
  chainId: 688689,
  rpcUrl: "https://atlantic.dplabs-internal.com",
  wsUrl: "wss://atlantic.dplabs-internal.com",
  nativeCurrency: "PHRS",
  explorerUrl: "https://atlantic.pharosscan.xyz/",
  explorerApiUrl: "https://api.socialscan.io/pharos-atlantic-testnet",
  explorerVerifyApiUrl:
    "https://api.socialscan.io/pharos-atlantic-testnet/v1/explorer/command_api/contract",
} as const;

export const pharosLegacyTestnet = {
  name: "pharos-testnet-legacy",
  chainId: 688688,
  rpcUrl: "https://testnet.dplabs-internal.com",
  nativeCurrency: "PHRS",
  explorerUrl: "https://testnet.pharosscan.xyz/",
  explorerApiUrl: "https://api.socialscan.io/pharos-testnet",
  explorerVerifyApiUrl:
    "https://api.socialscan.io/pharos-testnet/v1/explorer/command_api/contract",
} as const;
