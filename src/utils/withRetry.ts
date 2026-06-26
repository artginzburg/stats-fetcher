interface RetryOptions {
  /** Number of retries after the initial attempt. */
  retries?: number;
  /** Delay before the first retry, in milliseconds. Doubles on each subsequent retry. */
  baseDelayMs?: number;
}

/**
 * Retries an async function with exponential backoff.
 *
 * Useful for flaky network sources (transient `429 Too Many Requests`, premature
 * connection closes, etc.) so a single hiccup doesn't drop a data point.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  { retries = 3, baseDelayMs = 1000 }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      const delay = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
