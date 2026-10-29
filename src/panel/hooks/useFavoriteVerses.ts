import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CURRENT_USER_FAVORITES_ID,
  getFavoriteVersesByID,
  getMyFavoriteVerses,
} from "../actions/social/FavoriteVerses";

export const useFavoriteVerses = (id: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ["favorite-verses", id],
    initialPageParam: null as string | null,

    queryFn: ({ pageParam }) =>
      id === CURRENT_USER_FAVORITES_ID
        ? getMyFavoriteVerses(pageParam)
        : getFavoriteVersesByID(id, pageParam),
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,

    enabled: enabled && Boolean(id),
  });
};
