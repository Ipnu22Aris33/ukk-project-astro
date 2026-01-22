// hooks/useSubmitMutation.ts
import type { ToastEvent } from "@constants/toastType";
import { setToast } from "@utils/triggerToast";
import { toast } from "sonner";
import { TOAST_MAP } from "@constants/toastType";

// Import atau definisikan style yang sama
const TOAST_STYLE = {
  style: {
    fontSize: "14px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  classNames: {
    toast: "shadow-lg border",
    title: "font-semibold",
    description: "text-sm text-gray-600",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  },
} as const;

type ToastConfig = {
  event: ToastEvent;
  title?: string;
  description?: string;
};

type ToastMode = "sessionStorage" | "direct";

export function useSubmitMutation<T>(
  mutate: (data: T) => Promise<any>,
  options?: {
    successToast?: ToastConfig;
    errorToast?: ToastConfig;
    redirectTo?: string;
    toastMode?: ToastMode;
  }
) {
  const handleSubmit = async (data: T) => {
    try {
      await mutate(data);

      if (options?.successToast) {
        if (options.toastMode === "direct") {
          const toastConfig = TOAST_MAP[options.successToast.event];
          if (toastConfig) {
            // ✅ Apply SAME style
            toast[toastConfig.type](options.successToast.title ?? toastConfig.title, {
              description: options.successToast.description ?? toastConfig.description,
              style: TOAST_STYLE.style,
              classNames: TOAST_STYLE.classNames,
            });
          }
        } else {
          setToast(options.successToast.event, {
            title: options.successToast.title,
            description: options.successToast.description,
          });
        }
      }

      if (options?.redirectTo) {
        window.location.href = options.redirectTo;
        return;
      }
    } catch (err) {
      if (options?.errorToast) {
        if (options.toastMode === "direct") {
          const toastConfig = TOAST_MAP[options.errorToast.event];
          if (toastConfig) {
            // ✅ Apply SAME style
            toast[toastConfig.type](options.errorToast.title ?? toastConfig.title, {
              description: options.errorToast.description ?? toastConfig.description,
              style: TOAST_STYLE.style,
              classNames: TOAST_STYLE.classNames,
            });
          }
        } else {
          setToast(options.errorToast.event, {
            title: options.errorToast.title,
            description: options.errorToast.description,
          });
        }
      }

      throw err;
    }
  };

  return handleSubmit;
}