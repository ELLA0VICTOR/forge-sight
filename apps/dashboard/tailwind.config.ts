import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--bg-void)",
        base: "var(--bg-base)",
        panel: "var(--bg-panel)",
        elevated: "var(--bg-elevated)",
        inset: "var(--bg-inset)",
        line: {
          subtle: "var(--line-subtle)",
          strong: "var(--line-strong)",
          hot: "var(--line-hot)",
        },
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          disabled: "var(--text-disabled)",
        },
        scan: {
          DEFAULT: "var(--scan)",
          dim: "var(--scan-dim)",
        },
        risk: {
          safe: "var(--risk-safe)",
          caution: "var(--risk-caution)",
          danger: "var(--risk-danger)",
          critical: "var(--risk-critical)",
        },
        pos: "var(--pos)",
        neg: "var(--neg)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        scan: "0 0 0 1px var(--scan-dim), 0 0 24px var(--scan-glow)",
        critical: "0 0 0 1px var(--risk-critical), 0 0 28px var(--risk-critical-glow)",
        panel: "0 1px 0 0 var(--line-subtle), 0 8px 24px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
