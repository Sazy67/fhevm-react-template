import type { FhevmInstance } from "../../fhevmTypes";

export interface UniversalFhevmInstance extends FhevmInstance {
  // Extended interface for universal SDK
}

export interface UniversalFhevmConfig {
  provider: string | object;
  chainId: number;
  mockChains?: Record<number, string>;
}

export interface CreateFhevmInstanceOptions {
  provider: string | object;
  chainId?: number;
  mockChains?: Record<number, string>;
  signal?: AbortSignal;
  onStatusChange?: (status: string) => void;
}

export type FhevmEnvironment = 'browser' | 'node' | 'unknown';