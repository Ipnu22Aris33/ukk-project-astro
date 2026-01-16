import type { ToastEvent } from "@constants/toastType";

type TriggerToastOptions = {
  title?: string;
  description?: string;
};

export function setToast(event: ToastEvent, options?: TriggerToastOptions) {
  sessionStorage.setItem("toast", JSON.stringify({ event, options }));
}
