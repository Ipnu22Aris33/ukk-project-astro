import { useState } from "react";

export function useMutation<T = any, V = any>(mutationFn: (variables: V) => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = async (variables: V) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(variables);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}
