// Vue composable for the universal FHEVM SDK

import { ref, Ref } from "vue";
import type { UniversalFhevmInstance, CreateFhevmInstanceOptions } from "../../../core/types";
import { createUniversalFhevmInstance } from "../../../core/fhevm";

// Type definitions
export type UniversalFhevmGoState = "idle" | "loading" | "ready" | "error";

export interface UseUniversalFhevmParameters {
  provider: string | object | undefined;
  chainId: number | undefined;
  enabled?: boolean;
  initialMockChains?: Readonly<Record<number, string>>;
}

export interface UseUniversalFhevmResult {
  instance: Ref<UniversalFhevmInstance | undefined>;
  refresh: () => void;
  error: Ref<Error | undefined>;
  status: Ref<UniversalFhevmGoState>;
}

export function useUniversalFhevm(parameters: UseUniversalFhevmParameters): UseUniversalFhevmResult {
  const { provider, chainId, initialMockChains, enabled = true } = parameters;

  const instance = ref<UniversalFhevmInstance | undefined>(undefined);
  const status = ref<UniversalFhevmGoState>("idle");
  const error = ref<Error | undefined>(undefined);
  const isRunning = ref<boolean>(enabled);
  const providerChanged = ref<number>(0);
  
  let abortController: AbortController | null = null;
  let providerRef: string | object | undefined = provider;
  let chainIdRef: number | undefined = chainId;
  let mockChainsRef: Record<number, string> | undefined = initialMockChains as any;

  const refresh = () => {
    if (abortController) {
      providerRef = undefined;
      chainIdRef = undefined;

      abortController.abort();
      abortController = null;
    }

    providerRef = provider;
    chainIdRef = chainId;

    instance.value = undefined;
    error.value = undefined;
    status.value = "idle";

    if (provider !== undefined) {
      providerChanged.value += 1;
    }
  };

  // Initialize
  refresh();

  const initializeFhevm = () => {
    if (!isRunning.value) {
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      instance.value = undefined;
      error.value = undefined;
      status.value = "idle";
      return;
    }

    if (providerRef === undefined) {
      instance.value = undefined;
      error.value = undefined;
      status.value = "idle";
      return;
    }

    if (!abortController) {
      abortController = new AbortController();
    }

    if (abortController.signal.aborted) {
      throw new Error("!abortController.signal.aborted");
    }

    status.value = "loading";
    error.value = undefined;

    const thisSignal = abortController.signal;
    const thisProvider = providerRef;
    const thisRpcUrlsByChainId = mockChainsRef as any;

    const options: CreateFhevmInstanceOptions = {
      signal: thisSignal,
      provider: thisProvider as any,
      mockChains: thisRpcUrlsByChainId as any,
      onStatusChange: (s: string) => console.log(`[useUniversalFhevm] createUniversalFhevmInstance status changed: ${s}`),
    };
    
    if (chainIdRef !== undefined) {
      options.chainId = chainIdRef;
    }

    createUniversalFhevmInstance(options)
      .then((i: any) => {
        if (thisSignal.aborted) return;
        if (thisProvider !== providerRef) {
          throw new Error("thisProvider !== providerRef");
        }

        instance.value = i;
        error.value = undefined;
        status.value = "ready";
      })
      .catch((e: any) => {
        if (thisSignal.aborted) return;

        if (thisProvider !== providerRef) {
          throw new Error("thisProvider !== providerRef");
        }

        instance.value = undefined;
        error.value = e;
        status.value = "error";
      });
  };

  // Watch for changes
  const watchForChanges = () => {
    initializeFhevm();
  };

  // Initial call
  watchForChanges();

  return { instance, refresh, error, status };
}