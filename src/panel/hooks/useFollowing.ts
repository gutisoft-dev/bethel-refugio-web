import { useQuery } from "@tanstack/react-query";
import { getFollowingByID } from "../actions/social/Follower";

export const useFollowing = (id: string) => {
  return useQuery({
    queryKey: ["following", id],
    queryFn: async () => {
      const response = await getFollowingByID(id);

      return {
        ...response,
      };
    },
  });
};