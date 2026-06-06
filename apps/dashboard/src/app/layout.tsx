import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Foresight",
  description: "Transaction simulation and safety layer for Pharos agents.",
};

const extensionErrorGuard = `
(() => {
  const isWalletExtensionError = (event) => {
    const message = String(
      event?.message ||
      event?.reason?.message ||
      event?.error?.message ||
      ""
    );
    const source = String(event?.filename || event?.source || "");

    return (
      source.startsWith("chrome-extension://") &&
      message.includes("Cannot redefine property: ethereum")
    );
  };

  window.addEventListener(
    "error",
    (event) => {
      if (!isWalletExtensionError(event)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true
  );

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      if (!isWalletExtensionError(event)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true
  );
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} ${plexMono.variable}`}>
        <Script id="extension-error-guard" strategy="beforeInteractive">
          {extensionErrorGuard}
        </Script>
        {children}
      </body>
    </html>
  );
}
