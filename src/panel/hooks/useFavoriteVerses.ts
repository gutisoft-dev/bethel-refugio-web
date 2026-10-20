import { useQuery } from "@tanstack/react-query";
import {
  CURRENT_USER_FAVORITES_ID,
  getFavoriteVersesByID,
  getMyFavoriteVerses,
} from "../actions/social/FavoriteVerses";

export const useFavoriteVerses = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["favorite-verses", id],
    queryFn: () =>
      id === CURRENT_USER_FAVORITES_ID
        ? getMyFavoriteVerses()
        : getFavoriteVersesByID(id),
    enabled: enabled && Boolean(id),
  });
};
