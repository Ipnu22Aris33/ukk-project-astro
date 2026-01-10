import { useState } from "react";

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
};

export const useFetch = (url: string, defaultOptions?: FetchOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const call = async (bodyData?: any, options?: FetchOptions) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        method: options?.method || defaultOptions?.method || "POST",
        headers: {
          "Content-Type": "application/json",
          ...(defaultOptions?.headers || {}),
          ...(options?.headers || {}),
        },
        body: bodyData ? JSON.stringify(bodyData) : undefined,
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const resData = await res.json().catch(() => null);
      setData(resData);
      return resData;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error, data };
};
