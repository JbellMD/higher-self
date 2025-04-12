import { useState, useCallback } from 'react';

interface ApiOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  execute: (body?: any) => Promise<T | null>;
}

/**
 * Custom hook for making API calls with built-in error handling
 * @param options API call options
 * @returns API response state and execute function
 */
export function useApi<T = any>(options: ApiOptions): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Create a controller for the fetch request
  const controller = new AbortController();
  const { signal } = controller;

  // Set a timeout to abort the request if it takes too long
  const timeoutId = options.timeout 
    ? setTimeout(() => controller.abort(), options.timeout) 
    : null;

  const execute = useCallback(async (customBody?: any): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      // Use the custom body if provided, otherwise use the one from options
      const requestBody = customBody !== undefined ? customBody : options.body;
      
      const response = await fetch(options.url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: requestBody ? JSON.stringify(requestBody) : undefined,
        signal,
      });

      // Clear the timeout if the request completes
      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: 'Unknown error occurred' };
        }

        throw new Error(
          errorData.error || `Request failed with status ${response.status}`
        );
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err: any) {
      // Handle AbortError separately
      if (err.name === 'AbortError') {
        const timeoutError = new Error('Request timed out. Please try again.');
        setError(timeoutError);
        throw timeoutError;
      }

      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options.url, options.method, options.headers, options.body, options.timeout, signal, timeoutId]);

  // Cleanup function to abort any in-flight requests when the component unmounts
  const cleanup = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    controller.abort();
  }, [controller, timeoutId]);

  return { data, error, loading, execute };
}
