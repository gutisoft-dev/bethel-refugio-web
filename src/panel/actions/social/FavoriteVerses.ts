import { BethelApi } from "@/api/BethelApi";
import type { FavoriteVersesInterfacesTs } from "@/panel/interfaces/FavoriteVeses.inferface";

export const CURRENT_USER_FAVORITES_ID = "__current_user_favorites__";

const getCursorToken = (cursor: string) => {
  try {
    return new URL(cursor, "https://cursor.local").searchParams.get("cursor") ?? cursor;
  } catch {
    return cursor;
  }
};

export const getMyFavoriteVerses = async (
  cursor?: string,
): Promise<FavoriteVersesInterfacesTs> => {
  const { data } = await BethelApi.get<FavoriteVersesInterfacesTs>(
    "/social/favorite-verses/",
    { params: cursor ? { cursor: getCursorToken(cursor) } : undefined },
  );
  return data;
};

export const getFavoriteVersesByID = async (userId: string) => {
  const { data } = await BethelApi.get<FavoriteVersesInterfacesTs>(
    `/social/users/${userId}/favorite-verses/`,
  );
  return data;
};

export const deleteFavoriteVerse = async (verse: string) => {
  await BethelApi.delete(`/social/favorite-verses/${verse}/`);
};
