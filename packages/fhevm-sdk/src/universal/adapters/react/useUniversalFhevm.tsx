import { useCallback, useEffect, useRef, useState } from "react";
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
  instance: UniversalFhevmInstance | undefined;
  refresh: () => void;
  error: Error | undefined;
  status: UniversalFhevmGoState;
}

export function useUniversalFhevm(parameters: UseUniversalFhevmParameters): UseUniversalFhevmResult {
  const { provider, chainId, initialMockChains, enabled = true } = parameters;

  const [instance, _setInstance] = useState<UniversalFhevmInstance | undefined>(undefined);
  const [status, _setStatus] = useState<UniversalFhevmGoState>("idle");
  const [error, _setError] = useState<Error | undefined>(undefined);
  const [_isRunning, _setIsRunning] = useState<boolean>(enabled);
  const [_providerChanged, _setProviderChanged] = useState<number>(0);
  const _abortControllerRef = useRef<AbortController | null>(null);
  const _providerRef = useRef<string | object | undefined>(provider);
  const _chainIdRef = useRef<number | undefined>(chainId);
  const _mockChainsRef = useRef<Record<number, string> | undefined>(initialMockChains as any);

  const refresh = useCallback(() => {
    if (_abortControllerRef.current) {
      _providerRef.current = undefined;
      _chainIdRef.current = undefined;

      _abortControllerRef.current.abort();
      _abortControllerRef.current = null;
    }

    _providerRef.current = provider;
    _chainIdRef.current = chainId;

    _setInstance(undefined);
    _setError(undefined);
    _setStatus("idle");

    if (provider !== undefined) {
      _setProviderChanged((prev: number) => prev + 1);
    }
  }, [provider, chainId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    _setIsRunning(enabled);
  }, [enabled]);

  useEffect(() => {
    if (_isRunning === false) {
      if (_abortControllerRef.current) {
        _abortControllerRef.current.abort();
        _abortControllerRef.current = null;
      }
      _setInstance(undefined);
      _setError(undefined);
      _setStatus("idle");
      return;
    }

    if (_isRunning === true) {
      if (_providerRef.current === undefined) {
        _setInstance(undefined);
        _setError(undefined);
        _setStatus("idle");
        return;
      }

      if (!_abortControllerRef.current) {
        _abortControllerRef.current = new AbortController();
      }

      // @ts-ignore
      if (_abortControllerRef.current.signal.aborted) {
        throw new Error("!controllerRef.current.signal.aborted");
      }

      _setStatus("loading");
      _setError(undefined);

      const thisSignal = _abortControllerRef.current.signal;
      const thisProvider = _providerRef.current;
      const thisRpcUrlsByChainId = _mockChainsRef.current as any;

      const options: CreateFhevmInstanceOptions = {
        signal: thisSignal,
        provider: thisProvider as any,
        mockChains: thisRpcUrlsByChainId as any,
        onStatusChange: (s: string) => console.log(`[useUniversalFhevm] createUniversalFhevmInstance status changed: ${s}`),
      };
      
      if (_chainIdRef.current !== undefined) {
        options.chainId = _chainIdRef.current;
      }

      createUniversalFhevmInstance(options)
        .then((i: any) => {
          // @ts-ignore
          if (thisSignal.aborted) return;
          // @ts-ignore
          if (thisProvider !== _providerRef.current) {
            throw new Error("thisProvider !== _providerRef.current");
          }

          _setInstance(i);
          _setError(undefined);
          _setStatus("ready");
        })
        .catch((e: any) => {
          // @ts-ignore
          if (thisSignal.aborted) return;

          // @ts-ignore
          if (thisProvider !== _providerRef.current) {
            throw new Error("thisProvider !== _providerRef.current");
          }

          _setInstance(undefined);
          _setError(e as any);
          _setStatus("error");
        });
    }
  }, [_isRunning, _providerChanged]);

  return { instance, refresh, error, status };
}