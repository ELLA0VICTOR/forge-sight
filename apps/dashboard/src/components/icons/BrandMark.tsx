export function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2.5 20 7v10l-8 4.5L4 17V7z" stroke="var(--line-strong)" strokeWidth="1.25" />
      <circle cx="12" cy="12" r="5" stroke="var(--text-secondary)" strokeWidth="1.25" />
      <path d="M12 4.5v3M12 16.5v3M4.8 12h2.7M16.5 12h2.7" stroke="var(--text-tertiary)" strokeWidth="1.1" />
      <circle cx="14.4" cy="9.6" r="1.5" fill="var(--scan)" />
    </svg>
  );
}
