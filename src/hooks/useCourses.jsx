// api, axios (axios secure), tan stack

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useCourses = (OriginId) => {
  const axiosSecure = useAxiosSecure();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", OriginId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/courses/${OriginId}`);
      return response.data;
    },
    enabled: !!OriginId, // Only enable this query if user.email exists
  });

  return [courses, isLoading];
};

export default useCourses;
