import type { ToastEvent } from "@constants/toastType";
import { setToast } from "@utils/triggerToast";

type ToastConfig = {
  event: ToastEvent;
  title?: string;
  description?: string;
};

export function useSubmitMutation<T>(
  mutate: (data: T) => Promise<any>,
  options?: {
    successToast?: ToastConfig;
    errorToast?: ToastConfig;
    redirectTo?: string;
  }
) {
  const handleSubmit = async (data: T) => {
    try {
      await mutate(data);

      if (options?.successToast) {
        setToast(options.successToast.event, {
          title: options.successToast.title,
          description: options.successToast.description,
        });
      }

      if (options?.redirectTo) {
        window.location.href = options.redirectTo;
        return;
      }
    } catch (err) {
      if (options?.errorToast) {
        setToast(options.errorToast.event, {
          title: options.errorToast.title,
          description: options.errorToast.description,
        });
      }

      throw err;
    }
  };

  return handleSubmit;
}
