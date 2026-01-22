import { useState, useEffect, useCallback } from "react";

export function useFetch<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    let canceled = false;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
      }
      
      const json = await response.json();
      
      if (!canceled) {
        setData(json.data ?? json);
      }
    } catch (err) {
      if (!canceled) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      if (!canceled) {
        setLoading(false);
      }
    }

    return () => {
      canceled = true; // prevent setState after unmount
    };
  }, [url]);

  // Manual refetch function
  const refetch = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const cleanup = fetchData();
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [fetchData, trigger]);

  return { data, loading, error, refetch };
}