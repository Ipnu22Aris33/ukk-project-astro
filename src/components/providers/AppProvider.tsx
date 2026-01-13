// src/components/providers/AppProviders.tsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastProvider from "./ToastProvider";

const queryClient = new QueryClient();

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastProvider />
    </QueryClientProvider>
  );
}