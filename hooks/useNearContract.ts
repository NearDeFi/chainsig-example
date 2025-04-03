import { useMemo } from "react";
import { contracts } from "chainsig.js";
import { useEnv } from "./useEnv";
import useInitNear from "./useInitNear";

export const useNearContract = () => {
  const { nearAccount, nearNetworkId, nearChainSignatureContract } = useEnv();
  const { account, keyPair } = useInitNear();

  const chainSigContract = useMemo(() => {
    if (!account) return undefined;

    return new contracts.near.ChainSignatureContract({
      networkId: nearNetworkId as "mainnet" | "testnet",
      contractId: nearChainSignatureContract,
      accountId: nearAccount,
      keypair: keyPair,
    });
  }, [
    account,
    keyPair,
    nearAccount,
    nearChainSignatureContract,
    nearNetworkId,
  ]);

  return { chainSigContract };
};

export default useNearContract;
