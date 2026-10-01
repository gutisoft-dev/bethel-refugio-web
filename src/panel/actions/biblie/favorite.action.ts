import { BethelApi } from "@/api/BethelApi";

export const favoriteBibleVerse = async (
  normalizedReference: string,
): Promise<void> => {
  await BethelApi.post("/social/favorite-verses/", {
    normalized_reference: normalizedReference,
  });
};
