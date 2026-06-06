export function BrandMark({
  size = 108,
  className = "text-text1",
}: {
  size?: number;
  className?: string;
}) {
  const height = Math.round(size * 0.38);

  return (
    <svg width={size} height={height} viewBox="0 0 180 68" fill="none" aria-hidden className={className}>
      <path d="M12 56L26 10H96L90 25H43L40 34H82L77 48H36L32 56H12Z" fill="currentColor" />
      <path d="M55 40L91 10H118L82 40H55Z" fill="currentColor" />
      <path d="M87 24L99 10H166L158 27H111L108 34H158L147 56H69L77 39H128L131 33H87V24Z" fill="currentColor" />
      <path d="M112 4L101 22H118L91 47L171 20H143L155 4H112Z" fill="currentColor" opacity="0.96" />
    </svg>
  );
}