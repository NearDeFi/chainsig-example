import { useMemo } from "react";
import { constants, contracts } from "chainsig.js";
import { usePublicClient, useWalletClient } from "wagmi";

export const useEvmContract = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const chainSigContract = useMemo(() => {
    if (!publicClient || !walletClient) {
      return undefined;
    }

    return new contracts.evm.ChainSignatureContract({
      publicClient,
      walletClient: walletClient,
      contractAddress: constants.CONTRACT_ADDRESSES.ETHEREUM
        .TESTNET_DEV as `0x${string}`,
    });
  }, [publicClient, walletClient]);

  return { chainSigContract };
};
