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

export interface PublicStory {
  id: string;
  user?: {
    id: string;
    username: string;
  };
  visibility?: StoryVisibility;
  status?: string;
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

export const getStoriesPublic = async (
  cursor?: string,
): Promise<PublicStoriesResponse> => {
  const response = await BethelApi.get<PublicStoriesResponse>(
    "/stories/feed/public/",
    {
      params: cursor ? { cursor: getCursorToken(cursor) } : undefined,
    },
  );

  return response.data;
};

export type MyStoriesResponse = PublicStoriesResponse;

const getCursorToken = (cursor: string) => {
  try {
    return new URL(cursor, "https://cursor.local").searchParams.get("cursor") ?? cursor;
  } catch {
    return cursor;
  }
};

export const getMyStories = async (
  cursor?: string,
): Promise<MyStoriesResponse> => {
  const response = await BethelApi.get<MyStoriesResponse>("/stories/me/", {
    params: cursor ? { cursor: getCursorToken(cursor) } : undefined,
  });

  return response.data;
};

export const getFollowingStories = async (
  cursor?: string,
): Promise<PublicStoriesResponse> => {
  const response = await BethelApi.get<PublicStoriesResponse>(
    "/stories/feed/following/",
    {
      params: cursor ? { cursor: getCursorToken(cursor) } : undefined,
    },
  );

  return response.data;
};

export const registerStoryVerseView = async (
  storyId: string | number,
  position: number,
): Promise<void> => {
  await BethelApi.post(
    `/stories/${encodeURIComponent(storyId)}/verses/${position}/view/`,
  );
};

export const deleteStory = async (storyId: string | number): Promise<void> => {
  await BethelApi.delete(`/stories/${encodeURIComponent(storyId)}/`);
};

export const deleteStoryVerse = async (
  storyId: string | number,
  position: number,
): Promise<void> => {
  await BethelApi.delete(
    `/stories/${encodeURIComponent(storyId)}/verses/${position}/`,
  );
};

export type StoryVerseImageResult =
  | { type: "blob"; blob: Blob }
  | { type: "url"; url: string };

interface StoryVerseImageUrlPayload {
  url?: string;
  image_url?: string;
  image?: string;
  detail?: string;
  message?: string;
  error?: { message?: string };
}

export const getStoryVerseImage = async (
  storyId: string | number,
  position: number,
): Promise<StoryVerseImageResult> => {
  const response = await BethelApi.get<Blob>(
    `/stories/${encodeURIComponent(storyId)}/verses/${position}/image/`,
    { responseType: "blob" },
  );

  const blob = response.data;
  const contentType = String(response.headers["content-type"] ?? blob.type)
    .toLowerCase()
    .split(";")[0]
    .trim();

  if (contentType.startsWith("image/") || !contentType.includes("json")) {
    return { type: "blob", blob };
  }

  const raw = await blob.text();
  let payload: StoryVerseImageUrlPayload | string;
  try {
    payload = JSON.parse(raw) as StoryVerseImageUrlPayload | string;
  } catch {
    throw new Error("El servicio no devolvió una imagen válida.");
  }

  if (typeof payload === "string") {
    if (/^(https?:|blob:|data:image\/)/i.test(payload)) {
      return { type: "url", url: payload };
    }
    throw new Error("El servicio no devolvió una URL de imagen válida.");
  }

  const imageUrl = payload.url ?? payload.image_url ?? payload.image;
  if (imageUrl && /^(https?:|blob:|data:image\/)/i.test(imageUrl)) {
    return { type: "url", url: imageUrl };
  }

  throw new Error(
    payload.error?.message ??
      payload.detail ??
      payload.message ??
      "El servicio no devolvió una URL de imagen válida.",
  );
};

export interface StoryVerseView {
  id?: string | number;
  user?: {
    id?: string | number;
    username?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string | null;
    profile_picture?: string | null;
  };
  viewer?: {
    id?: string | number;
    username?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string | null;
    profile_picture?: string | null;
  };
  username?: string;
  viewed_at?: string;
  created_at?: string;
}

export interface StoryVerseViewsResponse {
  next: string | null;
  previous: string | null;
  results: StoryVerseView[];
}

export const getStoryVerseViews = async (
  storyId: string | number,
  position: number,
  cursor?: string,
): Promise<StoryVerseViewsResponse> => {
  const response = await BethelApi.get<StoryVerseViewsResponse>(
    `/stories/${encodeURIComponent(storyId)}/verses/${position}/views/`,
    {
      params: cursor ? { cursor: getCursorToken(cursor) } : undefined,
    },
  );

  return response.data;
};

