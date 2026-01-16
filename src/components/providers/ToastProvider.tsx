import { Toaster, toast } from "sonner";
import { useEffect } from "react";
import { TOAST_MAP, type ToastEvent } from "@constants/toastType";

export default function ToastProvider() {
  useEffect(() => {
    const raw = sessionStorage.getItem("toast");
    if (!raw) return;

    try {
      const { event, options } = JSON.parse(raw) as {
        event: ToastEvent;
        options?: {
          title?: string;
          description?: string;
        };
      };

      const toastConfig = TOAST_MAP[event];
      if (!toastConfig) return;

      toast[toastConfig.type](options?.title ?? toastConfig.title, {
        description: options?.description ?? toastConfig.description,
      });
    } finally {
      sessionStorage.removeItem("toast");
    }
  }, []);

  return (
    <Toaster
      position="top-center"
      theme="light"
      richColors
      closeButton
      expand
      duration={4000}
      gap={8}
      toastOptions={{
        style: { fontSize: "14px" },
        classNames: {},
      }}
    />
  );
}
