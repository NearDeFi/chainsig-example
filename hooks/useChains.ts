import { createPublicClient, http } from "viem";
import { chainAdapters, contracts } from "chainsig.js";
import { useEnv } from "./useEnv";

export const useChains = ({
  contract,
}: {
  contract?: contracts.ChainSignatureContract;
}) => {
  const { sepoliaInfuraUrl } = useEnv();
  if (!contract) return null;

  const publicClient = createPublicClient({
    transport: http(sepoliaInfuraUrl),
  }) as any;

  return {
    evm: new chainAdapters.evm.EVM({
      publicClient,
      contract: contract,
    }),

    btc: new chainAdapters.btc.Bitcoin({
      network: "testnet",
      btcRpcAdapter: new chainAdapters.btc.BTCRpcAdapters.Mempool(
        "https://mempool.space/testnet/api"
        // `https://blockstream.info/testnet/api`
      ),
      contract: contract,
    }),

    cosmos: new chainAdapters.cosmos.Cosmos({
      chainId: "osmo-test-5",
      contract: contract,
    }),
  };
};
