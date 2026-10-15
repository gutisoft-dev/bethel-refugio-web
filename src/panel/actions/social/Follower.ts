import { BethelApi } from "@/api/BethelApi";
import type { FollowerResponse } from "@/panel/interfaces/Follower.interface";

export const getFollowersByID = async (userId: string) => {
  const { data } = await BethelApi.get<FollowerResponse>(
    `/social/users/${userId}/followers/`,
  );
  return data;
};


export const getFollowingByID = async (userId: string) => {
  const { data } = await BethelApi.get<FollowerResponse>(
    `/social/users/${userId}/following/`,
  );
  return data;
};


export const createFollow = async (userId: string) => {
  const { data } = await BethelApi.post(
    `/social/users/${userId}/follow/`,
  );
  return data;
}