export const DEFAULT_MOCK_CHAINS: Record<number, string> = {
  31337: "http://localhost:8545",
};

export const FHEVM_RELAYER_STATUS = {
  SDK_LOADING: "sdk-loading",
  SDK_LOADED: "sdk-loaded",
  SDK_INITIALIZING: "sdk-initializing",
  SDK_INITIALIZED: "sdk-initialized",
  CREATING: "creating",
} as const;

export const FHEVM_ERRORS = {
  WEB3_CLIENTVERSION_ERROR: "WEB3_CLIENTVERSION_ERROR",
  FHEVM_RELAYER_METADATA_ERROR: "FHEVM_RELAYER_METADATA_ERROR",
} as const;