import useAxiosSecure from "./useAxiosSecure";
import useOptimizedQuery from "./useOptimizedQuery";
import { CACHE_KEYS } from "../utils/constants";

const useCourse = (courseId) => {
  const axiosSecure = useAxiosSecure();

  const { 
    data: courseData = {}, 
    isLoading, 
    error,
    refetch 
  } = useOptimizedQuery({
    queryKey: [CACHE_KEYS.COURSE, courseId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/course/${courseId}`);
      return response.data;
    },
    enabled: !!courseId,
    errorMessage: "Failed to load course details",
  });

  return [courseData, isLoading, refetch, error];
};

export default useCourse;
