import type { SimReport } from "@foresight/engine";

export function truncAddr(address: string, head = 6, tail = 4) {
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

function decimalFromWei(raw: string) {
  const value = BigInt(raw || "0");
  const whole = value / 1_000_000_000_000_000_000n;
  const frac = value % 1_000_000_000_000_000_000n;
  if (frac === 0n) return whole.toString();
  const padded = frac.toString().padStart(18, "0").replace(/0+$/, "");
  return `${whole}.${padded.slice(0, 4)}`;
}

export function txValueLabel(report: SimReport) {
  const raw = report.tx.value ?? "0";
  if (raw === "0") return "0 PHRS";
  const symbol = report.decoded.args.tokenIn === "0x838800b758277CC111B2d48Ab01e5E164f8E9471" ? "WPHRS" : "PHRS";
  return `${decimalFromWei(raw)} ${symbol}`;
}