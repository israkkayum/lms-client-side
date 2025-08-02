import { useQuery } from "@tanstack/react-query";
import { useToast } from "../providers/ToastProvider";
import { handleApiError } from "../utils/helpers";

/**
 * Optimized query hook with built-in error handling and toast notifications
 */
const useOptimizedQuery = ({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5 * 60 * 1000,
  showErrorToast = true,
  errorMessage = "Failed to fetch data",
  ...options
}) => {
  const { error: showError } = useToast();

  return useQuery({
    queryKey,
    queryFn: async (...args) => {
      try {
        return await queryFn(...args);
      } catch (error) {
        const userMessage = handleApiError(error);
        if (showErrorToast) {
          showError(userMessage);
        }
        throw error;
      }
    },
    enabled,
    staleTime,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
};

export default useOptimizedQuery;