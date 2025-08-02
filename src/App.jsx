import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { Suspense } from "react";
import Spinner from "./pages/Shared/Spinner/Spinner";
import "./App.css";

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <Suspense fallback={<Spinner />}>
              <RouterProvider router={router} />
            </Suspense>
            <ReactQueryDevtools initialIsOpen={false} />
          </HelmetProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;