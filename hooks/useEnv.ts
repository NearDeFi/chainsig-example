import { z } from "zod";

const envSchema = z.object({
  rainbowKitProjectId: z.string().min(1, "Project ID is required"),
  nearNetworkId: z.string().min(1, "Near Network ID is required"),
  nearAccount: z.string().min(1, "Near Account is required"),
  nearPrivateKey: z.string().min(1, "Near Private Key is required"),
  nearChainSignatureContract: z
    .string()
    .min(1, "Chain Signature Contract is required"),
  sepoliaInfuraUrl: z.string().min(1, "Sepolia Infura URL is required"),
});

export type EnvSchema = z.infer<typeof envSchema>;

export const useEnv = (): EnvSchema => {
  const parsed = envSchema.safeParse({
    rainbowKitProjectId: process.env.NEXT_PUBLIC_RAINBOW_KIT_PROJECT_ID,
    nearNetworkId: process.env.NEXT_PUBLIC_NEAR_NETWORK_ID,
    nearAccount: process.env.NEXT_PUBLIC_NEAR_ACCOUNT,
    nearPrivateKey: process.env.NEXT_PUBLIC_NEAR_PRIVATE_KEY,
    nearChainSignatureContract:
      process.env.NEXT_PUBLIC_NEAR_CHAIN_SIGNATURE_CONTRACT,
    sepoliaInfuraUrl: process.env.NEXT_PUBLIC_SEPOLIA_INFURA_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(parsed.error.errors)}`
    );
  }

  return parsed.data;
};
