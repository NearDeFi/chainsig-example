"use client";

import { useEffect, useState, Suspense } from "react";
import { useChains } from "@/hooks/useChains";
import {
  signBtcTransaction,
  signCosmosTransaction,
  signEvmSignMessage,
  signEvmSignTypedData,
  signEvmTransaction,
} from "@/lib/signMethods";
import { useEvmContract } from "@/hooks/useEvmContract";
import useNearContract from "@/hooks/useNearContract";
import useInitNear from "@/hooks/useInitNear";
import { useWalletClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Header } from "@/components/header";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { contracts, chainAdapters } from "chainsig.js";
// import { ThemeProviderProps } from "next-themes";

// Define ContractType and ChainsType

type ContractType = contracts.ChainSignatureContract;
type ChainsType = {
  evm: chainAdapters.evm.EVM;
  btc: chainAdapters.btc.Bitcoin;
  cosmos: chainAdapters.cosmos.Cosmos;
};

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "near";
  const isNearMode = mode === "near";

  // EVM related hooks
  const { chainSigContract: evmContract } = useEvmContract();
  const { data: walletClient } = useWalletClient();

  // NEAR related hooks
  const { chainSigContract: nearContract } = useNearContract();
  const { account } = useInitNear();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState<ContractType | null>(null);
  const [chains, setChains] = useState<ChainsType | null>(null);
  const [predecessorId, setPredecessorId] = useState<string>("");

  useEffect(() => {
    if (isNearMode) {
      if (nearContract && account) {
        setContract(nearContract);
        const chains = useChains({ contract: nearContract });
        if (chains) {
          setChains(chains);
          setPredecessorId(account.accountId);
          setIsLoading(false);
        }
      }
    } else {
      if (evmContract && walletClient) {
        setContract(evmContract);
        const chains = useChains({ contract: evmContract });
        if (chains) {
          setChains(chains);
          setPredecessorId(walletClient.account.address);
          setIsLoading(false);
        }
      }
    }
  }, [isNearMode, nearContract, evmContract, account, walletClient]);

  if (isLoading || !contract || !chains) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
              <CardDescription>
                {isNearMode
                  ? "Connecting to NEAR network"
                  : "Please connect your wallet to continue"}
              </CardDescription>
            </CardHeader>
            {!isNearMode && (
              <CardFooter className="flex justify-center">
                <ConnectButton />
              </CardFooter>
            )}
          </Card>
        </main>
      </div>
    );
  }

  const handleEvmTransaction = async () => {
    await signEvmTransaction({
      chainSigContract: contract,
      evm: chains.evm,
      predecessorId,
    });
  };

  const handleEvmSignMessage = async () => {
    await signEvmSignMessage({
      chainSigContract: contract,
      evm: chains.evm,
      predecessorId,
    });
  };

  const handleEvmSignTypedData = async () => {
    await signEvmSignTypedData({
      chainSigContract: contract,
      evm: chains.evm,
      predecessorId,
    });
  };

  const handleBtcTransaction = async () => {
    await signBtcTransaction({
      chainSigContract: contract,
      btc: chains.btc,
      predecessorId,
    });
  };

  const handleOsmosisTransaction = async () => {
    await signCosmosTransaction({
      chainSigContract: contract,
      cosmos: chains.cosmos,
      predecessorId,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {isNearMode ? "NEAR" : "EVM"} Cross-Chain Transactions
          </h1>
          {isNearMode && account && (
            <div className="mt-4 text-sm text-muted-foreground border rounded-md p-2 bg-muted/50 max-w-md mx-auto">
              Connected as:{" "}
              <span className="font-mono">{account.accountId}</span>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Ethereum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleEvmTransaction}
                  variant="outline"
                  className="h-14"
                >
                  Send EVM Transaction
                </Button>
                <Button
                  onClick={handleEvmSignMessage}
                  variant="outline"
                  className="h-14"
                >
                  Sign EVM Message
                </Button>
                <Button
                  onClick={handleEvmSignTypedData}
                  variant="outline"
                  className="h-14"
                >
                  Sign EVM Typed Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bitcoin</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleBtcTransaction}
                  variant="outline"
                  className="w-full h-14"
                >
                  Send BTC Transaction
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cosmos</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleOsmosisTransaction}
                  variant="outline"
                  className="w-full h-14"
                >
                  Send Osmosis Transaction
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {!isNearMode && (
          <div className="flex justify-center mt-8">
            <ConnectButton />
          </div>
        )}
      </main>
    </div>
  );
}
