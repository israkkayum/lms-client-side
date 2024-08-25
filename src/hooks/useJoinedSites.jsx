// api, axios (axios secure), tan stack

import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useJoinedSites = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: joinedSites = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["joinedSites", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sites/joined/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email, // Only enable this query if user.email exists
  });

  return [joinedSites, isLoading, refetch];
};

export default useJoinedSites;
