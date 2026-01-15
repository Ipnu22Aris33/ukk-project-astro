import { Toaster, toast } from "sonner";
import { useEffect } from "react";

export default function ToastProvider() {
  useEffect(() => {
    const type = sessionStorage.getItem("toast");

    if (!type) return;

    if (type === "login-success") {
      toast.success("Berhasil login 👋");
    }

    sessionStorage.removeItem("toast");
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
        style: {
          fontSize: "14px",
        },
      }}
    />
  );
}
