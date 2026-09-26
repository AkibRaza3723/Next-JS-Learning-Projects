"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function QueryClientProviderClient({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  //we use useState so that it valid for life cycl.
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ); 
}

export default QueryClientProviderClient;