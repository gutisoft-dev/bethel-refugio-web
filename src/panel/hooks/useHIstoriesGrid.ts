import { useCallback, useEffect, useRef, useState } from "react";
import {
  getFollowingStories,
  getMyStories,
  getStoriesPublic,
  type PublicStory,
} from "../actions/history/story.action";
import type { HistoryFeed } from "../components/histories/HistoriesHeader";
import { useAuthStore } from "@/auth/store/auth.store";
import { getFeedLabel } from "../helpers/getAll";

interface Props {
  feed?: HistoryFeed;
}

interface StoriesPage {
  results: PublicStory[];
  next: string | null;
}

const loadStoriesPage = (
  feed: HistoryFeed,
  cursor?: string,
): Promise<StoriesPage> =>
  feed === "mine"
    ? getMyStories(cursor)
    : feed === "following"
      ? getFollowingStories(cursor)
      : getStoriesPublic(cursor);



export const useHIstoriesGrid = ({ feed = "mine" }: Props) => {
  const { authStatus } = useAuthStore();

  const [stories, setStories] = useState<PublicStory[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageError, setPageError] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    let isCurrent = true;

    const loadFirstPage = async () => {
      setIsLoading(true);
      setError(null);
      setStories([]);
      setNextCursor(null);
      setSelectedStoryId(null);

      if (feed !== "public" && authStatus !== "authenticated") {
        setError("Inicia sesión para consultar estas historias.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await loadStoriesPage(feed);
        if (!isCurrent) return;
        setStories(response.results);
        setNextCursor(response.next);
      } catch {
        if (isCurrent) setError(`No se pudieron cargar ${getFeedLabel(feed)}.`);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    void loadFirstPage();
    return () => {
      isCurrent = false;
    };
  }, [feed, reloadKey]);

  const loadNextPage = useCallback(async () => {
    if (!nextCursor || loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    setPageError(false);
    try {
      const response = await loadStoriesPage(feed, nextCursor);
      setStories((current) => [...current, ...response.results]);
      setNextCursor(response.next);
    } catch {
      setPageError(true);
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [feed, nextCursor]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollContainerRef.current;
    if (!sentinel || !root || !nextCursor || isLoading || pageError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void loadNextPage();
      },
      { root, rootMargin: "360px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, loadNextPage, nextCursor, pageError]);


   const handleSelectedStoryId = (id: string | null) => {
    setSelectedStoryId(id);
  };

  return {
    stories,
    nextCursor,
    isLoading,
    isLoadingMore,
    error,
    pageError,
    selectedStoryId,
    handleSelectedStoryId,
    reloadKey,
    setReloadKey,
    scrollContainerRef,
    sentinelRef,
    loadNextPage
  };
};
