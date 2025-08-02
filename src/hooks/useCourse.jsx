import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { CACHE_KEYS } from "../utils/constants";

const useCourse = (courseId) => {
  const axiosSecure = useAxiosSecure();

  const { 
    data: courseData = {}, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: [CACHE_KEYS.COURSE, courseId],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(`/course/${courseId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.userMessage || "Failed to fetch course");
      }
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { courseData, isLoading, error, refetch };
};

export default useCourse;
