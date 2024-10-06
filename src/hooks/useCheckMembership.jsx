import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useCheckMembership = (siteName, email) => {
  const axiosSecure = useAxiosSecure();

  const {
    data: isMember,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["isMember", siteName, email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sites/${siteName}/is-member`, {
        params: { email },
      });
      return res.data.isMember;
    },
    enabled: !!siteName && !!email, // Only run query if siteName and email are available
  });

  return [isMember, isLoading, refetch];
};

export default useCheckMembership;
