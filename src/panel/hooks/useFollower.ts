import { useQuery } from "@tanstack/react-query";
import { getFollowersByID } from "../actions/social/Follower";

export const useFollower = (id: string) => {
  return useQuery({
    queryKey: ["follower", id],
    queryFn: async () => {
      const response = await getFollowersByID(id);

      return {
        ...response,
      };
    },
  });
};