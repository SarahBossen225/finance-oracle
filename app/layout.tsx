import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import WalletErrorHandler from "../components/WalletErrorHandler";

// Polyfill global and self for FHEVM SDK (client-side only)
if (typeof window !== 'undefined') {
  if (typeof global === 'undefined') {
    (window as any).global = globalThis;
  }
  if (typeof self === 'undefined') {
    (window as any).self = globalThis;
  }
}

export const metadata: Metadata = {
  title: "Finance Oracle - Secure Financial Data Platform",
  description: "Privacy-preserving financial data and market analytics using FHE technology",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <WalletErrorHandler />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}