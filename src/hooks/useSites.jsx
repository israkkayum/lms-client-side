// api, axios (axios secure), tan stack

import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useSites = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: sites = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["sites", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sites/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email, // Only enable this query if user.email exists
  });

  return [sites, isLoading, refetch];
};

export default useSites;
