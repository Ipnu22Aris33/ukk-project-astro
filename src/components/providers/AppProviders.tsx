import React from "react";
import ToastProvider from "./ToastProvider";
import ReactQueryProvider from "./ReactQueryProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {children}
      <ToastProvider />
    </ReactQueryProvider>
  );
}
