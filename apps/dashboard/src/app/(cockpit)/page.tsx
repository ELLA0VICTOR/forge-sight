import { AppShell } from "../../components/layout/AppShell";

export default function CockpitPage({
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
