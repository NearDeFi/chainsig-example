"use client";

import { useEffect, useState } from "react";
import {
  Account,
  connect,
  ConnectConfig,
  KeyPair,
  keyStores,
  Near,
} from "near-api-js";
import { useEnv } from "@/hooks/useEnv";
import { KeyPairString } from "near-api-js/lib/utils";

const useInitNear = () => {
  const [state, setState] = useState<
    | {
        account: Account;
        connection: Near;
        keyPair: KeyPair;
      }
    | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { nearAccount, nearNetworkId, nearPrivateKey } = useEnv();

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      const keyStore = new keyStores.InMemoryKeyStore();
      const keyPair = KeyPair.fromString(nearPrivateKey as KeyPairString);
      await keyStore.setKey(nearNetworkId, nearAccount, keyPair);

      const config: ConnectConfig = {
        networkId: nearNetworkId,
        keyStore,
        nodeUrl:
          nearNetworkId === "mainnet"
            ? "https://free.rpc.fastnear.com"
            : "https://test.rpc.fastnear.com",
        helperUrl:
          nearNetworkId === "mainnet"
            ? "https://helper.mainnet.near.org"
            : "https://helper.testnet.near.org",
      };

      const connection = await connect(config);
      const account = await connection.account(nearAccount);

      setState({ connection, account, keyPair });
      setIsLoading(false);
    };

    initialize();
  }, [nearAccount, nearNetworkId, nearPrivateKey]);

  return { ...state, isLoading };
};

export default useInitNear;
