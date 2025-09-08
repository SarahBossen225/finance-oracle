import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hardhat } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Finance Oracle",
  projectId: process.env['NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID'] || "e08e99d213c331aa0fd00f625de06e66",
  chains: [sepolia, hardhat],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export const chains = [sepolia, hardhat];