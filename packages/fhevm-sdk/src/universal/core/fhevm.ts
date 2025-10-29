import { isAddress, Eip1193Provider, JsonRpcProvider } from "ethers";
import type { CreateFhevmInstanceOptions, UniversalFhevmInstance } from "./types";
import { FHEVM_RELAYER_STATUS, FHEVM_ERRORS } from "./constants";
import { FhevmInstance } from "../../fhevmTypes";

// Environment detection
export const detectEnvironment = (): 'browser' | 'node' | 'unknown' => {
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    return 'browser';
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return 'node';
  }
  return 'unknown';
};

// Error classes
export class UniversalFhevmError extends Error {
  code: string;
  constructor(code: string, message?: string, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.name = "UniversalFhevmError";
  }
}

export class UniversalFhevmAbortError extends Error {
  constructor(message = "FHEVM operation was cancelled") {
    super(message);
    this.name = "UniversalFhevmAbortError";
  }
}

function throwFhevmError(
  code: string,
  message?: string,
  cause?: unknown
): never {
  throw new UniversalFhevmError(code, message, cause ? { cause } : undefined);
}

// Helper functions
async function getChainId(
  providerOrUrl: Eip1193Provider | string
): Promise<number> {
  if (typeof providerOrUrl === "string") {
    const provider = new JsonRpcProvider(providerOrUrl);
    return Number((await provider.getNetwork()).chainId);
  }
  // @ts-ignore
  const chainId = await providerOrUrl.request({ method: "eth_chainId" });
  return Number.parseInt(chainId as string, 16);
}

async function getWeb3Client(rpcUrl: string) {
  const rpc = new JsonRpcProvider(rpcUrl);
  try {
    const version = await rpc.send("web3_clientVersion", []);
    return version;
  } catch (e) {
    throwFhevmError(
      FHEVM_ERRORS.WEB3_CLIENTVERSION_ERROR,
      `The URL ${rpcUrl} is not a Web3 node or is not reachable. Please check the endpoint.`,
      e
    );
  } finally {
    rpc.destroy();
  }
}

async function tryFetchFHEVMHardhatNodeRelayerMetadata(rpcUrl: string): Promise<
  | {
      ACLAddress: `0x${string}`;
      InputVerifierAddress: `0x${string}`;
      KMSVerifierAddress: `0x${string}`;
    }
  | undefined
> {
  const version = await getWeb3Client(rpcUrl);
  if (
    typeof version !== "string" ||
    !version.toLowerCase().includes("hardhat")
  ) {
    // Not a Hardhat Node
    return undefined;
  }
  try {
    const metadata = await getFHEVMRelayerMetadata(rpcUrl);
    if (!metadata || typeof metadata !== "object") {
      return undefined;
    }
    if (
      !(
        "ACLAddress" in metadata &&
        typeof metadata.ACLAddress === "string" &&
        metadata.ACLAddress.startsWith("0x")
      )
    ) {
      return undefined;
    }
    if (
      !(
        "InputVerifierAddress" in metadata &&
        typeof metadata.InputVerifierAddress === "string" &&
        metadata.InputVerifierAddress.startsWith("0x")
      )
    ) {
      return undefined;
    }
    if (
      !(
        "KMSVerifierAddress" in metadata &&
        typeof metadata.KMSVerifierAddress === "string" &&
        metadata.KMSVerifierAddress.startsWith("0x")
      )
    ) {
      return undefined;
    }
    return metadata;
  } catch {
    // Not a FHEVM Hardhat Node
    return undefined;
  }
}

async function getFHEVMRelayerMetadata(rpcUrl: string) {
  const rpc = new JsonRpcProvider(rpcUrl);
  try {
    const version = await rpc.send("fhevm_relayer_metadata", []);
    return version;
  } catch (e) {
    throwFhevmError(
      FHEVM_ERRORS.FHEVM_RELAYER_METADATA_ERROR,
      `The URL ${rpcUrl} is not a FHEVM Hardhat node or is not reachable. Please check the endpoint.`,
      e
    );
  } finally {
    rpc.destroy();
  }
}

type MockResolveResult = { isMock: true; chainId: number; rpcUrl: string };
type GenericResolveResult = { isMock: false; chainId: number; rpcUrl?: string };
type ResolveResult = MockResolveResult | GenericResolveResult;

async function resolve(
  providerOrUrl: Eip1193Provider | string,
  mockChains?: Record<number, string>
): Promise<ResolveResult> {
  // Resolve chainId
  const chainId = await getChainId(providerOrUrl);

  // Resolve rpc url
  let rpcUrl = typeof providerOrUrl === "string" ? providerOrUrl : undefined;

  const _mockChains: Record<number, string> = {
    31337: "http://localhost:8545",
    ...(mockChains ?? {}),
  };

  // Help Typescript solver here:
  if (Object.hasOwn(_mockChains, chainId)) {
    if (!rpcUrl) {
      rpcUrl = _mockChains[chainId];
    }

    return { isMock: true, chainId, rpcUrl };
  }

  return { isMock: false, chainId, rpcUrl };
}

// Main function to create FHEVM instance
export const createUniversalFhevmInstance = async (parameters: CreateFhevmInstanceOptions): Promise<UniversalFhevmInstance> => {
  const {
    provider: providerOrUrl,
    mockChains,
    signal,
    onStatusChange,
  } = parameters;

  const notify = (status: string) => {
    if (onStatusChange) onStatusChange(status);
  };

  const throwIfAborted = () => {
    if (signal && signal.aborted) throw new UniversalFhevmAbortError();
  };

  // Resolve chainId
  const { isMock, rpcUrl, chainId } = await resolve(providerOrUrl, mockChains);

  if (isMock && rpcUrl) {
    // Throws an error if cannot connect or url does not refer to a Web3 client
    const fhevmRelayerMetadata =
      await tryFetchFHEVMHardhatNodeRelayerMetadata(rpcUrl);

    if (fhevmRelayerMetadata) {
      notify(FHEVM_RELAYER_STATUS.CREATING);

      // Dynamic import to avoid including the entire FHEVM mock lib in production bundle
      const fhevmMock = await import("../../internal/mock/fhevmMock");
      const mockInstance = await fhevmMock.fhevmMockCreateInstance({
        rpcUrl,
        chainId,
        metadata: fhevmRelayerMetadata,
      });

      throwIfAborted();

      return mockInstance as UniversalFhevmInstance;
    }
  }

  throwIfAborted();

  // For browser environment, we need to load and initialize the relayer SDK
  if (detectEnvironment() === 'browser') {
    // Check if window.relayerSDK exists
    if (typeof window !== 'undefined' && (window as any).relayerSDK) {
      const windowAny = window as any;
      
      if (!windowAny.relayerSDK.__initialized__) {
        notify(FHEVM_RELAYER_STATUS.SDK_INITIALIZING);

        // Initialize the SDK
        try {
          const result = await windowAny.relayerSDK.initSDK();
          windowAny.relayerSDK.__initialized__ = result;
          if (!result) {
            throw new Error("window.relayerSDK.initSDK failed.");
          }
        } catch (error) {
          throw new Error("Failed to initialize relayer SDK: " + (error as Error).message);
        }
        
        throwIfAborted();
        notify(FHEVM_RELAYER_STATUS.SDK_INITIALIZED);
      }

      const relayerSDK = windowAny.relayerSDK;
      const aclAddress = relayerSDK.SepoliaConfig?.aclContractAddress || relayerSDK.aclContractAddress;
      
      if (!aclAddress || !isAddress(aclAddress)) {
        throw new Error(`Invalid ACL address: ${aclAddress}`);
      }

      // Get public key storage (this will need to be adapted for universal use)
      const publicKeyStorage = await import("../../internal/PublicKeyStorage");
      const pub = await publicKeyStorage.publicKeyStorageGet(aclAddress);
      throwIfAborted();

      const config: any = {
        ...relayerSDK.SepoliaConfig,
        network: providerOrUrl,
        publicKey: pub.publicKey,
        publicParams: pub.publicParams,
      };

      notify(FHEVM_RELAYER_STATUS.CREATING);

      const instance = await relayerSDK.createInstance(config);

      // Save the key even if aborted
      await publicKeyStorage.publicKeyStorageSet(
        aclAddress,
        instance.getPublicKey(),
        instance.getPublicParams(2048)
      );

      throwIfAborted();

      return instance as UniversalFhevmInstance;
    } else {
      // In a browser environment but no relayerSDK available
      throw new Error("Relayer SDK not available in browser environment. Make sure to include the FHEVM relayer script.");
    }
  } else {
    // For Node.js environment, we might need a different approach
    // This would depend on how the FHEVM SDK is supposed to work in Node.js
    throw new Error("FHEVM SDK initialization not implemented for Node.js environment yet.");
  }
};