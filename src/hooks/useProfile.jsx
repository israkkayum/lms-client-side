// api, axios (axios secure), tan stack

import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isLoading, data: profile = {} } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email, // Only enable this query if user.email exists
  });

  return [profile, isLoading];
};

export default useProfile;
