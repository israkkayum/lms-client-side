// api, axios (axios secure), tan stack

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useSite = (siteName) => {
  const axiosSecure = useAxiosSecure();

  const { data: siteData = {}, isLoading } = useQuery({
    queryKey: ["siteDetails", siteName],
    queryFn: async () => {
      const response = await axiosSecure.get(`/sites/by-name/${siteName}`);
      return response.data;
    },
    enabled: !!siteName, // Only enable this query if user.email exists
  });

  return [siteData, isLoading];
};

export default useSite;
