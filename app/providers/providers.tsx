"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useEnv } from "@/hooks/useEnv";

type ProvidersProps = {
  children: React.ReactNode;
};

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const { rainbowKitProjectId, sepoliaInfuraUrl } = useEnv();

  const config = getDefaultConfig({
    appName: "Signet Examples",
    projectId: rainbowKitProjectId,
    chains: [
      { ...sepolia, rpcUrls: { default: { http: [sepoliaInfuraUrl] } } },
    ],
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
