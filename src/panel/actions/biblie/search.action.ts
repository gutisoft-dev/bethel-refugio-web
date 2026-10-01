import { BethelApi } from "@/api/BethelApi";

export interface BibleBook {
  slug: string;
  name: string;
}

export interface BibleVerse {
  reference: string;
  normalized_reference: string;
  text: string;
  chapter: number;
  verse: number;
  book: BibleBook;
}

export interface BiblePagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface VerseSearchResponse {
  data: BibleVerse[];
  pagination: BiblePagination;
}

export const searchBibleVerses = async (
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<VerseSearchResponse> => {
  const result = await BethelApi<VerseSearchResponse>(
    `/bible/verses/search/?q=${encodeURIComponent(query)}&page=${page}`,
    { signal },
  );

  return result.data;
};
