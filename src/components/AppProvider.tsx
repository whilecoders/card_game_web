"use client";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Create a client
const queryClient = new QueryClient();

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <ToastContainer />
    </>
  );
}
