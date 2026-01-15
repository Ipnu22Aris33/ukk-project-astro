import ToastProvider from "./ToastProvider";
import ReactQueryProvider from "./ReactQueryProvider";

export default function GlobalProviders() {
  return (
    <ReactQueryProvider>
      <ToastProvider />
    </ReactQueryProvider>
  );
}
