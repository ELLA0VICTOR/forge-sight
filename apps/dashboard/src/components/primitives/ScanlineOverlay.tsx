export function ScanlineOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 opacity-100"
      style={{
        background:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 2px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 3px, transparent 3px 6px)",
      }}
    />
  );
}
