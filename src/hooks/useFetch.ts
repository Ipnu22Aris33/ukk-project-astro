import { useState, useCallback } from "react";

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
};

export const useFetch = (url: string, defaultOptions?: FetchOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const call = useCallback(
    async (bodyData?: any, options?: FetchOptions) => {
      setLoading(true);
      setError(null);

      try {
        const method = options?.method || defaultOptions?.method || "POST";
        const fetchOptions: RequestInit = {
          method,
          headers: {
            ...(defaultOptions?.headers || {}),
            ...(options?.headers || {}),
          },
        };

        // Hanya tambahkan body dan Content-Type jika bukan GET
        if (method !== "GET" && bodyData) {
          fetchOptions.body = JSON.stringify(bodyData);
          fetchOptions.headers = {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
          };
        }

        const res = await fetch(url, fetchOptions);

        if (!res.ok)
          throw new Error(`Request failed with status ${res.status}`);
        const resData = await res.json().catch(() => null);
        setData(resData);
        return resData;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, defaultOptions]
  );

  return { call, loading, error, data };
};
