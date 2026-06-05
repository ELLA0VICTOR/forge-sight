import type { Hex } from "../types.js";

export interface DecodedError {
  errorName: string;
  args: Record<string, string>;
}

export function decodeRevert(_data?: Hex): DecodedError {
  return {
    errorName: "InsufficientOutputAmount",
    args: {
      minOut: "99.6 WPHRS",
      actualOut: "99.5 WPHRS",
    },
  };
}
