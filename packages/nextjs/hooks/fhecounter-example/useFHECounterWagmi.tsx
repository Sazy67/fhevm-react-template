"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDeployedContractInfo } from "../helper";
import { useWagmiEthers } from "../wagmi/useWagmiEthers";
// Temporarily disabled for deployment
// import { FhevmInstance } from "@fhevm-sdk";
// import {
//   buildParamsFromAbi,
//   getEncryptionMethod,
//   useFHEDecrypt,
//   useFHEEncryption,
//   useInMemoryStorage,
// } from "@fhevm-sdk";

type FhevmInstance = any; // Mock type
import { ethers } from "ethers";
import type { Contract } from "~~/utils/helper/contract";
import type { AllowedChainIds } from "~~/utils/helper/networks";
import { useReadContract } from "wagmi";

/**
 * useFHECounterWagmi - Minimal FHE Counter hook for Wagmi devs
 *
 * What it does:
 * - Reads the current encrypted counter
 * - Decrypts the handle on-demand with useFHEDecrypt
 * - Encrypts inputs and writes increment/decrement
 *
 * Pass your FHEVM instance and a simple key-value storage for the decryption signature.
 * That's it. Everything else is handled for you.
 */
export const useFHECounterWagmi = (parameters: {
  instance: FhevmInstance | undefined;
  initialMockChains?: Readonly<Record<number, string>>;
}) => {
  const { instance, initialMockChains } = parameters;
  // Mock storage for deployment
  const fhevmDecryptionSignatureStorage = { get: () => null, set: () => {}, clear: () => {} };

  // Wagmi + ethers interop
  const { chainId, accounts, isConnected, ethersReadonlyProvider, ethersSigner } = useWagmiEthers(initialMockChains);

  // Resolve deployed contract info once we know the chain
  const allowedChainId = typeof chainId === "number" ? (chainId as AllowedChainIds) : undefined;
  const { data: fheCounter } = useDeployedContractInfo({ contractName: "FHECounter", chainId: allowedChainId });

  // Simple status string for UX messages
  const [message, setMessage] = useState<string>("");

  type FHECounterInfo = Contract<"FHECounter"> & { chainId?: number };

  const isRefreshing = false as unknown as boolean; // derived from wagmi below
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // -------------
  // Helpers
  // -------------
  const hasContract = Boolean(fheCounter?.address && fheCounter?.abi);
  const hasProvider = Boolean(ethersReadonlyProvider);
  const hasSigner = Boolean(ethersSigner);

  const getContract = (mode: "read" | "write") => {
    if (!hasContract) return undefined;
    const providerOrSigner = mode === "read" ? ethersReadonlyProvider : ethersSigner;
    if (!providerOrSigner) return undefined;
    return new ethers.Contract(
      fheCounter!.address,
      (fheCounter as FHECounterInfo).abi,
      providerOrSigner,
    );
  };

  // Read count handle via wagmi
  const readResult = useReadContract({
    address: (hasContract ? (fheCounter!.address as unknown as `0x${string}`) : undefined) as
      | `0x${string}`
      | undefined,
    abi: (hasContract ? ((fheCounter as FHECounterInfo).abi as any) : undefined) as any,
    functionName: "getCount" as const,
    query: {
      enabled: Boolean(hasContract && hasProvider),
      refetchOnWindowFocus: false,
    },
  });

  const countHandle = useMemo(() => (readResult.data as string | undefined) ?? undefined, [readResult.data]);
  const canGetCount = Boolean(hasContract && hasProvider && !readResult.isFetching);
  const refreshCountHandle = useCallback(async () => {
    const res = await readResult.refetch();
    if (res.error) setMessage("FHECounter.getCount() failed: " + (res.error as Error).message);
  }, [readResult]);
  // derive isRefreshing from wagmi
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _derivedIsRefreshing = readResult.isFetching;

  // Wagmi handles initial fetch via `enabled`

  // Mock decrypt functionality for deployment
  const requests = useMemo(() => {
    if (!hasContract || !countHandle || countHandle === ethers.ZeroHash) return undefined;
    return [{ handle: countHandle, contractAddress: fheCounter!.address } as const];
  }, [hasContract, fheCounter?.address, countHandle]);

  // Mock decrypt hook
  const canDecrypt = false;
  const decrypt = () => {};
  const isDecrypting = false;
  const decMsg = "Decryption temporarily disabled for deployment";
  const results: Record<string, bigint> = {};

  useEffect(() => {
    if (decMsg) setMessage(decMsg);
  }, [decMsg]);

  const clearCount = useMemo(() => {
    if (!countHandle) return undefined;
    if (countHandle === ethers.ZeroHash) return { handle: countHandle, clear: BigInt(0) } as const;
    const clear = results[countHandle];
    if (typeof clear === "undefined") return undefined;
    return { handle: countHandle, clear } as const;
  }, [countHandle, results]);

  const isDecrypted = Boolean(countHandle && clearCount?.handle === countHandle);
  const decryptCountHandle = decrypt;

  // Mock encryption for deployment
  const encryptWith = () => Promise.resolve(null);
  const canUpdateCounter = useMemo(
    () => Boolean(hasContract && instance && hasSigner && !isProcessing),
    [hasContract, instance, hasSigner, isProcessing],
  );

  const getEncryptionMethodFor = (functionName: "increment" | "decrement") => {
    // Mock for deployment
    return { method: "euint32" as string | undefined, error: undefined } as const;
  };

  const updateCounter = useCallback(
    async (value: number) => {
      if (isProcessing || !canUpdateCounter || value === 0) return;
      const op = value > 0 ? "increment" : "decrement";
      const valueAbs = Math.abs(value);
      setIsProcessing(true);
      setMessage(`Starting ${op}(${valueAbs})...`);
      try {
        const { method, error } = getEncryptionMethodFor(op);
        if (!method) return setMessage(error ?? "Encryption method not found");

        setMessage(`Encrypting with ${method}...`);
        const enc = await encryptWith(builder => {
          (builder as any)[method](valueAbs);
        });
        if (!enc) return setMessage("Encryption failed");

        const writeContract = getContract("write");
        if (!writeContract) return setMessage("Contract info or signer not available");

        const params = []; // Mock params for deployment
        const tx = await (op === "increment" ? writeContract.increment(...params) : writeContract.decrement(...params));
        setMessage("Waiting for transaction...");
        await tx.wait();
        setMessage(`${op}(${valueAbs}) completed!`);
        refreshCountHandle();
      } catch (e) {
        setMessage(`${op} failed: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, canUpdateCounter, encryptWith, getContract, refreshCountHandle, fheCounter?.abi],
  );

  return {
    contractAddress: fheCounter?.address,
    canDecrypt,
    canGetCount,
    canUpdateCounter,
    updateCounter,
    decryptCountHandle,
    refreshCountHandle,
    isDecrypted,
    message,
    clear: clearCount?.clear,
    handle: countHandle,
    isDecrypting,
    isRefreshing,
    isProcessing,
    // Wagmi-specific values
    chainId,
    accounts,
    isConnected,
    ethersSigner,
  };
};
