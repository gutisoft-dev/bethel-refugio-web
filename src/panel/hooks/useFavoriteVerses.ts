import { useQuery } from "@tanstack/react-query";
import { getFavoriteVersesByID } from "../actions/social/FavoriteVerses";

export const useFavoriteVerses = (id: string) => {
  return useQuery({
    queryKey: ["favorite-verses", id],
    queryFn: async () => {
      const response = await getFavoriteVersesByID(id);

      return {
        ...response,
      };
    },
  });
};
