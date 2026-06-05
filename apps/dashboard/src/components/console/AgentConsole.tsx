"use client";

import { Panel } from "../primitives/Panel";
import { useForesightStore } from "../../store/useForesightStore";
import { ConsoleMessage } from "./ConsoleMessage";

export function AgentConsole() {
  const messages = useForesightStore((state) => state.consoleShown);

  return (
    <Panel title="AGENT CONSOLE" className="h-full">
      <div className="h-full overflow-y-auto px-3 py-2">
        <div className="border-l border-line-subtle">
          {messages.map((step) => (
            <ConsoleMessage key={step.id} step={step} />
          ))}
        </div>
      </div>
    </Panel>
  );
}
