import { BethelApi } from "@/api/BethelApi";
import type { FavoriteVersesInterfacesTs } from "@/panel/interfaces/FavoriteVeses.inferface";

export const CURRENT_USER_FAVORITES_ID = "__current_user_favorites__";

export const getMyFavoriteVerses = async (
  cursor?: string | null,
): Promise<FavoriteVersesInterfacesTs> => {
  const params = cursor
    ? Object.fromEntries(new URL(cursor, "http://localhost").searchParams)
    : undefined;
  console.log(params);

  const { data } = await BethelApi.get<FavoriteVersesInterfacesTs>(
    "/social/favorite-verses/",
    { params },
  );
  return data;
};

export const getFavoriteVersesByID = async (
  userId: string,
  next?: string | null,
) => {
  const endpoint = `/social/users/${userId}/favorite-verses/`;

  const params = next
    ? Object.fromEntries(new URL(next, "http://localhost").searchParams)
    : undefined;
  console.log(params);
  const { data } = await BethelApi.get<FavoriteVersesInterfacesTs>(endpoint, {
    params,
  });

  return data;
};

export const deleteFavoriteVerse = async (verse: string) => {
  await BethelApi.delete(`/social/favorite-verses/${verse}/`);
};
