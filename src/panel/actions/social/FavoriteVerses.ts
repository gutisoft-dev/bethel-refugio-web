import { BethelApi } from "@/api/BethelApi";
import type { FavoriteVersesInterfacesTs } from "@/panel/interfaces/FavoriteVeses.inferface";

export const getFavoriteVersesByID = async (userId: string) => {
  const { data } = await BethelApi.get<FavoriteVersesInterfacesTs>(
    `/social/users/${userId}/favorite-verses/`,
  );
  return data;
};

export const deleteFavoriteVerse = async (verse: string) => {
  await BethelApi.delete(`/social/favorite-verses/${verse}/`);
};
