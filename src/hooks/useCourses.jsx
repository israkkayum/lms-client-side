import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { CACHE_KEYS } from "../utils/constants";

const useCourses = (OriginId) => {
  const axiosSecure = useAxiosSecure();

  const { 
    data: courses = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: [CACHE_KEYS.COURSES, OriginId],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(`/courses/${OriginId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.userMessage || "Failed to fetch courses");
      }
    },
    enabled: !!OriginId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { courses, isLoading, error, refetch };
};

export default useCourses;
