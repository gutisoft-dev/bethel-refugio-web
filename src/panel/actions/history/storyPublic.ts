import { BethelApi } from "@/api/BethelApi";

export interface PublicStory {
  id: string;
  user: {
    id: string;
    username: string;
  };
  created_at: string;
  expires_at: string;
  verses: {
    position: number;
    verse: {
      id: number;
      reference: string;
      normalized_reference: string;
      text: string;
    };
    caption: string | null;
    is_favorite: boolean;
    count_favorite: number;
    is_reaction: boolean;
    count_reaction: number;
    is_view: boolean;
    views_count: number;
  }[];
}

export interface PublicStoriesResponse {
  next: string | null;
  previous: string | null;
  results: PublicStory[];
}

export const getStoriesPublic = async (): Promise<PublicStoriesResponse> => {
  const response = await BethelApi.get<PublicStoriesResponse>(
    "/stories/feed/public/",
  );

  return response.data;
};
