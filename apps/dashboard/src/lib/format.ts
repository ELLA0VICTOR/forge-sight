import type { Address } from "@foresight/engine";

export function truncAddr(address: Address | string, head = 6, tail = 4) {
  if (address.length <= head + tail) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

export function signed(value: string) {
  if (value.startsWith("+") || value.startsWith("-")) return value;
  return Number(value) >= 0 ? `+${value}` : value;
}

export function pct(value: number) {
  return `${value.toFixed(1)}%`;
}

export function gas(value: string) {
  return `${Number(value).toLocaleString()} gas`;
}

export function formatUnitsStr(value: string, maxFrac = 4) {
  const [whole, frac = ""] = value.split(".");
  if (!frac) return whole ?? value;
  return `${whole}.${frac.slice(0, maxFrac)}`;
}
