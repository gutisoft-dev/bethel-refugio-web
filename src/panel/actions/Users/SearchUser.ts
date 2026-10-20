import { BethelApi } from "@/api/BethelApi";
import type { FollowerResponse } from "@/panel/interfaces/Follower.interface";

export const SearchUser = async (username?: string) => {
  const { data } = await BethelApi.get<FollowerResponse>(`/users/search`, {
    params: { q: username },
  });
  return data;
};
