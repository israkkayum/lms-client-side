// api, axios (axios secure), tan stack

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useCourse = (courseId) => {
  const axiosSecure = useAxiosSecure();

  const { data: courseData = {}, isLoading } = useQuery({
    queryKey: ["courseData", courseId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/course/${courseId}`);
      return response.data;
    },
    enabled: !!courseId, // Only enable this query if user.email exists
  });

  return [courseData, isLoading];
};

export default useCourse;
