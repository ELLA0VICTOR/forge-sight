import { AppShell } from "../../components/layout/AppShell";

export default function DemoPage({
  searchParams,
}: {
  searchParams?: { scenario?: string; mode?: string };
}) {
  return (
    <AppShell
      initialScenario={searchParams?.scenario ?? "honeypot"}
      initialMode={searchParams?.mode === "live" ? "live" : "demo"}
    />
  );
}
