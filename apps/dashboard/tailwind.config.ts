import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        bgDeep: "var(--bg-deep)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        surface3: "var(--surface-3)",
        border: "var(--border)",
        border2: "var(--border-2)",
        text1: "var(--text-1)",
        text2: "var(--text-2)",
        text3: "var(--text-3)",
        text4: "var(--text-4)",
        button: "var(--button)",
        buttonText: "var(--button-text)",
        green: "var(--green)",
        red: "var(--red)",
        amber: "var(--amber)",
        teal: "var(--teal)",
        violet: "var(--violet)",
        void: "var(--bg)",
        base: "var(--bg)",
        panel: "var(--surface)",
        elevated: "var(--surface-2)",
        inset: "var(--surface-2)",
        line: {
          subtle: "var(--border)",
          strong: "var(--border-2)",
          hot: "#605d6b",
        },
        ink: {
          primary: "var(--text-1)",
          secondary: "var(--text-2)",
          tertiary: "var(--text-3)",
          disabled: "var(--text-4)",
        },
        scan: {
          DEFAULT: "var(--teal)",
          dim: "var(--teal-dim)",
        },
        risk: {
          safe: "var(--green)",
          caution: "var(--amber)",
          danger: "var(--red)",
          critical: "var(--red)",
        },
        pos: "var(--green)",
        neg: "var(--red)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "10px",
        lg: "16px",
      },
      boxShadow: {
        frame: "0 24px 80px rgba(0,0,0,0.34)",
      },
    },
  },
  plugins: [],
} satisfies Config;
