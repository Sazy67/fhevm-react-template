// Utility functions for the universal FHEVM SDK

/**
 * Checks if a value is a valid Ethereum address
 * @param value The value to check
 * @returns True if the value is a valid Ethereum address, false otherwise
 */
export const isEthereumAddress = (value: unknown): value is `0x${string}` => {
  if (typeof value !== "string") {
    return false;
  }
  
  // Basic regex for Ethereum address validation
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return addressRegex.test(value);
};

/**
 * Sleep function for adding delays
 * @param ms The number of milliseconds to sleep
 * @returns A promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry a function with exponential backoff
 * @param fn The function to retry
 * @param maxRetries The maximum number of retries
 * @param baseDelay The base delay in milliseconds
 * @returns The result of the function
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries) {
        const delay = baseDelay * Math.pow(2, i);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
};

/**
 * Format a big number for display
 * @param value The value to format
 * @param decimals The number of decimal places
 * @returns The formatted string
 */
export const formatBigNumber = (value: bigint | number, decimals: number = 18): string => {
  if (typeof value === 'number') {
    return value.toFixed(decimals);
  }
  
  // For bigint, we need to convert to string and format
  const stringValue = value.toString();
  if (stringValue.length <= decimals) {
    return `0.${stringValue.padStart(decimals, '0')}`;
  }
  
  const integerPart = stringValue.slice(0, -decimals);
  const fractionalPart = stringValue.slice(-decimals);
  return `${integerPart}.${fractionalPart}`;
};