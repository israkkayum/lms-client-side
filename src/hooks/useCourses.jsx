import useAxiosSecure from "./useAxiosSecure";
import useOptimizedQuery from "./useOptimizedQuery";
import { CACHE_KEYS } from "../utils/constants";

const useCourses = (OriginId) => {
  const axiosSecure = useAxiosSecure();

  const { 
    data: courses = [], 
    isLoading, 
    error,
    refetch 
  } = useOptimizedQuery({
    queryKey: [CACHE_KEYS.COURSES, OriginId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/courses/${OriginId}`);
      return response.data;
    },
    enabled: !!OriginId,
    errorMessage: "Failed to load courses",
  });

  return [courses, isLoading, refetch, error];
};

export default useCourses;
