import { BethelApi } from "@/api/BethelApi";

export interface CreateStoryVerse {
  reference: string;
  caption?: string;
}

export type StoryVisibility = "public" | "followers";

export interface CreateBibleStoryPayload {
  visibility: StoryVisibility;
  verses: CreateStoryVerse[];
}

export interface CreateBibleStoryResponse {
  id: number | string;
}

export const createBibleStory = async (
  payload: CreateBibleStoryPayload,
): Promise<CreateBibleStoryResponse> => {
  const response = await BethelApi.post<CreateBibleStoryResponse>(
    "/stories/",
    payload,
  );
  return response.data;
};
