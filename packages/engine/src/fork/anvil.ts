import { execa } from "execa";
import type { NetworkConfig } from "../types.js";

type AnvilProcess = ReturnType<typeof execa>;

export interface AnvilFork {
  url: string;
  process?: AnvilProcess;
}

export async function startAnvilFork(config: NetworkConfig): Promise<AnvilFork> {
  const port = process.env.ANVIL_PORT ?? "8546";
  const args = ["--fork-url", config.rpcUrl, "--port", port];

  if (config.forkBlock) {
    args.push("--fork-block-number", String(config.forkBlock));
  }

  if (process.env.FORESIGHT_SPAWN_ANVIL === "true") {
    const child = execa("anvil", args, {
      stderr: "pipe",
      stdout: "pipe",
    });
    return { url: `http://127.0.0.1:${port}`, process: child };
  }

  return { url: `http://127.0.0.1:${port}` };
}

export async function stopAnvilFork(fork: AnvilFork): Promise<void> {
  if (fork.process) {
    fork.process.kill("SIGTERM");
  }
}