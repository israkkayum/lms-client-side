import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../providers/ToastProvider";
import { handleApiError } from "../utils/helpers";

/**
 * Optimized mutation hook with built-in error handling and success notifications
 */
const useOptimizedMutation = ({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries = [],
  showSuccessToast = true,
  showErrorToast = true,
  successMessage = "Operation completed successfully",
  ...options
}) => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate specified queries
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      // Show success toast
      if (showSuccessToast) {
        success(successMessage);
      }

      // Call custom onSuccess handler
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      const userMessage = handleApiError(error);
      
      // Show error toast
      if (showErrorToast) {
        showError(userMessage);
      }

      // Call custom onError handler
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...options,
  });
};

export default useOptimizedMutation;