import { Toaster } from "sonner";

export default function ToastProvider() {
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
        style: {
          fontSize: "14px",
        },
      }}
    />
  );
}
