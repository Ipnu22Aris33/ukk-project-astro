// hooks/useCRUD.ts
import { useState } from "react";
import { toast } from "sonner";

export interface UseCRUDConfig {
  endpoint: string;
  refetch?: () => void;
  successMessages: {
    create: string;
    update: string;
    delete: string;
  };
}

export function useCRUD<T>({ endpoint, refetch, successMessages }: UseCRUDConfig) {
  const [saving, setSaving] = useState(false);

  const create = async (data: Partial<T>) => {
    return await handleRequest("POST", endpoint, data, successMessages.create);
  };

  const update = async (id: number | string, data: Partial<T>) => {
    return await handleRequest("PATCH", `${endpoint}/${id}`, data, successMessages.update);
  };

  const remove = async (id: number | string, confirmationMessage?: string) => {
    if (confirmationMessage && !confirm(confirmationMessage)) {
      return false;
    }

    try {
      await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      toast.success(successMessages.delete);
      refetch?.();
      return true;
    } catch {
      toast.error("Gagal menghapus data");
      return false;
    }
  };

  const handleRequest = async (method: string, url: string, data: Partial<T>, successMessage: string) => {
    setSaving(true);

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      toast.success(successMessage);
      refetch?.();
      return true;
    } catch {
      toast.error("Gagal menyimpan data");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    create,
    update,
    remove,
    saving,
  };
}
