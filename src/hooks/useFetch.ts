import { useState, useEffect } from "react";

export function useFetch<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!canceled) setData(json.data ?? json);
      })
      .catch((err) => {
        if (!canceled) setError(err);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true; // prevent setState after unmount
    };
  }, [url]);

  return { data, loading, error };
}
