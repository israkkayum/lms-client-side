import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useSubmission = (assignmentId, userEmail) => {
  const axiosPublic = useAxiosPublic();

  const fetchSubmission = async () => {
    if (!assignmentId || !userEmail) return null;

    const response = await axiosPublic.get(
      `/assignments/${assignmentId}/submission/${userEmail}`
    );
    return response.data;
  };

  const {
    data: submission,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["submission", assignmentId, userEmail],
    queryFn: fetchSubmission,
    enabled: Boolean(assignmentId && userEmail),
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
    retry: 2, // Retry failed requests twice
  });

  const refetchSubmission = async () => {
    await refetch();
  };

  return {
    submission,
    loading,
    error: error?.message || error?.response?.data?.message || error,
    refetchSubmission,
  };
};

export default useSubmission;
