import type { Address } from "../types.js";

export interface StateOverride {
  address: Address;
  balance?: string;
  storage?: Record<string, string>;
}

export function buildStateOverrides(overrides: StateOverride[]): StateOverride[] {
  return overrides;
}
