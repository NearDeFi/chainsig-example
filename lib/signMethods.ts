import { chainAdapters, contracts } from "chainsig.js";
import * as chainsig from "chainsig.js";
import { recoverMessageAddress, recoverTypedDataAddress } from "viem";

export const signEvmTransaction = async ({
  chainSigContract,
  evm,
  predecessorId,
}: {
  chainSigContract: contracts.ChainSignatureContract;
  evm: chainAdapters.evm.EVM;
  predecessorId: string;
}) => {
  if (!chainSigContract) return;

  const path = "eth";

  const { address: from } = await evm.deriveAddressAndPublicKey(
    predecessorId,
    path
  );

  const { balance, decimals } = await evm.getBalance(from);
  console.log({ balance, decimals });

  const { transaction, hashesToSign } = await evm.prepareTransactionForSigning({
    from: from as `0x${string}`,
    to: "0x4174678c78fEaFd778c1ff319D5D326701449b25",
    value: 1n,
  });

  const rsvSignature = await chainSigContract?.sign({
    payload: hashesToSign[0],
    path,
    key_version: 0,
  });

  if (!rsvSignature) {
    throw new Error("Failed to sign transaction");
  }

  const tx = evm.finalizeTransactionSigning({
    transaction,
    rsvSignatures: [rsvSignature],
  });

  const txHash = await evm.broadcastTx(tx);

  console.log({ txHash });
};

export const signEvmSignMessage = async ({
  chainSigContract,
  evm,
  predecessorId,
}: {
  chainSigContract: contracts.ChainSignatureContract;
  evm: chainAdapters.evm.EVM;
  predecessorId: string;
}) => {
  const path = "eth";

  const { address: from } = await evm.deriveAddressAndPublicKey(
    predecessorId,
    path
  );

  const message = "Hello, world!";

  const { hashToSign } = await evm.prepareMessageForSigning(message);

  const rsvSignature = await chainSigContract?.sign({
    payload: hashToSign,
    path,
    key_version: 0,
  });

  if (!rsvSignature) {
    throw new Error("Failed to sign message");
  }

  const signedMessage = evm.finalizeMessageSigning({
    rsvSignature,
  });

  const messageSigner = await recoverMessageAddress({
    message,
    signature: signedMessage,
  });

  console.log({ signedMessage, messageSigner, from });
};

export const signEvmSignTypedData = async ({
  chainSigContract,
  evm,
  predecessorId,
}: {
  chainSigContract: contracts.ChainSignatureContract;
  evm: chainAdapters.evm.EVM;
  predecessorId: string;
}) => {
  const path = "eth";

  console.log("???", { chainAdapters, contracts }, chainsig);

  const { address: from } = await evm.deriveAddressAndPublicKey(
    predecessorId,
    path
  );

  const typedData = {
    domain: {
      name: "Example DApp",
      version: "1",
      chainId: 11155111,
      verifyingContract:
        "0x0000000000000000000000000000000000000000" as `0x${string}`,
    },
    types: {
      Person: [
        { name: "name", type: "string" },
        { name: "age", type: "uint256" },
      ],
    },
    primaryType: "Person" as const,
    message: {
      name: "Alice",
      age: 28,
    },
  };

  const { hashToSign } = await evm.prepareTypedDataForSigning(typedData);

  const rsvSignature = await chainSigContract?.sign({
    payload: hashToSign,
    path,
    key_version: 0,
  });

  if (!rsvSignature) {
    throw new Error("Failed to sign typed data");
  }

  const signedData = evm.finalizeTypedDataSigning({
    rsvSignature,
  });

  const typedDataSigner = await recoverTypedDataAddress({
    ...typedData,
    signature: signedData,
  });

  console.log({ signedData, typedDataSigner, from });
};

export const signBtcTransaction = async ({
  chainSigContract,
  btc,
  predecessorId,
}: {
  chainSigContract: contracts.ChainSignatureContract;
  btc: chainAdapters.btc.Bitcoin;
  predecessorId: string;
}) => {
  const path = "btc";

  const { publicKey, address: from } = await btc.deriveAddressAndPublicKey(
    predecessorId,
    path
  );

  console.log(" hello", { publicKey, from });
  const { balance, decimals } = await btc.getBalance(from);
  console.log({ balance, decimals, from });

  const { transaction, hashesToSign } = await btc.prepareTransactionForSigning({
    publicKey,
    from,
    to: "tb1qjcgmg9ekeujzkdp4ep6a2lqvc5y50495uvp4u0",
    value: "1000",
  });

  console.log({ transaction, hashesToSign });
  const rsvSignature = await chainSigContract?.sign({
    payload: hashesToSign[0],
    path,
    key_version: 0,
  });

  if (!rsvSignature) {
    throw new Error("Failed to sign transaction");
  }

  const tx = btc.finalizeTransactionSigning({
    transaction,
    rsvSignatures: [rsvSignature],
  });

  const txHash = await btc.broadcastTx(tx);

  console.log({ txHash });
};

export const signCosmosTransaction = async ({
  chainSigContract,
  cosmos,
  predecessorId,
}: {
  chainSigContract: contracts.ChainSignatureContract;
  cosmos: chainAdapters.cosmos.Cosmos;
  predecessorId: string;
}) => {
  const path = "osmo";

  const { address: from, publicKey } = await cosmos.deriveAddressAndPublicKey(
    predecessorId,
    path
  );

  const { balance, decimals } = await cosmos.getBalance(from);
  console.log({ balance, decimals });

  const { transaction, hashesToSign } =
    await cosmos.prepareTransactionForSigning({
      address: from,
      publicKey,
      messages: [
        {
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: from,
            toAddress: "osmo1q5heryp07w6dflc3h4egdca6nmmekk0aqkj9gp",
            amount: [{ denom: "uosmo", amount: "1000" }],
          },
        },
      ],
      memo: "test",
    });

  const rsvSignature = await chainSigContract?.sign({
    payload: hashesToSign[0],
    path,
    key_version: 0,
  });

  if (!rsvSignature) {
    throw new Error("Failed to sign transaction");
  }

  const tx = cosmos.finalizeTransactionSigning({
    transaction,
    rsvSignatures: [rsvSignature],
  });

  const txHash = await cosmos.broadcastTx(tx);

  console.log({ txHash });
};
