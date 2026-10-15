import { useCallback, useEffect, useRef, useState,  type TouchEvent, } from "react";
import type { HistoryFeed } from "../components/histories/HistoriesHeader";
import type { Historia } from "../interfaces/History.interface";
import { toSlides } from "../helpers/getAll";
import {
  getFollowingStories,
  getMyStories,
  getStoriesPublic,
  registerStoryVerseView,
  type PublicStory,
} from "../actions/history/story.action";
import axios from "axios";

interface Props {
  feed?: HistoryFeed;
  initialStoryId?: string;
  initialStories?: PublicStory[];
  initialCursor?: string | null;
}

interface StoriesApiError {
  detail?: string;
  message?: string;
  error?: { message?: string };
}

export const useDetailsHistory = ({
  feed = "public",
  initialStoryId,
  initialStories,
  initialCursor,
}: Props) => {
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAuthentication, setNeedsAuthentication] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedFeed, setLoadedFeed] = useState<HistoryFeed | null>(null);
  const recordedViews = useRef(new Set<string>());
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const loadStories = async () => {
      setIsLoading(true);
      setError(null);
      setNeedsAuthentication(false);
      setLoadedFeed(null);
      setHistorias([]);
      setNextCursor(null);
      setActiveIndex(0);

      try {
        if (feed !== "public" && !localStorage.getItem("token-access")) {
          setNeedsAuthentication(true);
          setError(
            feed === "mine"
              ? "Inicia sesión para consultar tus historias."
              : "Inicia sesión para consultar las historias que sigues.",
          );
          return;
        }

        if (initialStories) {
          const slides = toSlides(initialStories, feed === "mine");
          if (!isCurrent) return;
          setHistorias(slides);
          setNextCursor(initialCursor ?? null);
          const initialIndex = initialStoryId
            ? slides.findIndex((slide) => slide.storyId === initialStoryId)
            : -1;
          setActiveIndex(initialIndex >= 0 ? initialIndex : 0);
          setLoadedFeed(feed);
          return;
        }

        const response =
          feed === "mine"
            ? await getMyStories()
            : feed === "following"
              ? await getFollowingStories()
              : await getStoriesPublic();
        if (!isCurrent) return;

        if (!Array.isArray(response.results)) {
          throw new Error("El servicio devolvió una respuesta inesperada.");
        }

        const slides = toSlides(response.results, feed === "mine");
        setHistorias(slides);
        setNextCursor(response.next);
        const initialIndex = initialStoryId
          ? slides.findIndex((slide) => slide.storyId === initialStoryId)
          : -1;
        setActiveIndex(initialIndex >= 0 ? initialIndex : 0);
        setLoadedFeed(feed);
      } catch (requestError) {
        if (!isCurrent) return;

        if (axios.isAxiosError<StoriesApiError>(requestError)) {
          const status = requestError.response?.status;
          const apiMessage =
            requestError.response?.data?.error?.message ??
            requestError.response?.data?.detail ??
            requestError.response?.data?.message;

          if (feed !== "public" && status === 401) {
            setNeedsAuthentication(true);
            setError(
              feed === "mine"
                ? "Tu sesión no está activa. Inicia sesión para ver tus historias."
                : "Tu sesión no está activa. Inicia sesión para ver las historias que sigues.",
            );
          } else {
            setError(
              apiMessage ??
                (feed === "mine"
                  ? status
                    ? `No se pudieron cargar tus historias (HTTP ${status}).`
                    : "No se pudo conectar con el servicio de historias."
                  : feed === "following"
                    ? status
                      ? `No se pudieron cargar las historias que sigues (HTTP ${status}).`
                      : "No se pudo conectar con el servicio de historias que sigues."
                    : "No se pudieron cargar las historias públicas."),
            );
          }
        } else {
          setError(
            requestError instanceof Error
              ? requestError.message
              : feed === "mine"
                ? "No se pudieron cargar tus historias."
                : feed === "following"
                  ? "No se pudieron cargar las historias que sigues."
                  : "No se pudieron cargar las historias públicas.",
          );
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    void loadStories();

    return () => {
      isCurrent = false;
    };
  }, [feed, initialCursor, initialStories, initialStoryId, reloadKey]);

  const loadNextPage = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setPageError(false);
    try {
      const response =
        feed === "mine"
          ? await getMyStories(nextCursor)
          : feed === "following"
            ? await getFollowingStories(nextCursor)
            : await getStoriesPublic(nextCursor);
      const nextSlides = toSlides(response.results, feed === "mine");
      setHistorias((currentStories) => [...currentStories, ...nextSlides]);
      setNextCursor(response.next);
      if (nextSlides.length > 0) {
        setActiveIndex((currentIndex) => currentIndex + 1);
      }
    } catch {
      setPageError(true);
    } finally {
      setIsLoadingMore(false);
    }
  }, [feed, nextCursor, isLoadingMore]);

  const totalSlides = historias.length;

  const goPrevious = useCallback(() => {
    setActiveIndex((index) =>
      totalSlides ? (index + totalSlides - 1) % totalSlides : 0,
    );
  }, [totalSlides]);

  const goNext = useCallback(() => {
    if (activeIndex < totalSlides - 1) {
      setActiveIndex((index) => index + 1);
    } else if (nextCursor) {
      void loadNextPage();
    }
  }, [activeIndex, feed, loadNextPage, nextCursor, totalSlides]);

  const hasAutomaticNext = activeIndex < totalSlides - 1 || Boolean(nextCursor);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button, a, input, textarea")) {
      touchStart.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    if (deltaX < 0) goNext();
    else goPrevious();
  };

  useEffect(() => {
    if (totalSlides < 2 && !nextCursor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, [contenteditable='true']")
      ) {
        return;
      }

      if (event.key === "ArrowLeft") goPrevious();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides, feed, nextCursor, goPrevious, goNext]);

  const current = historias[activeIndex];
  const previous = historias.length
    ? historias[(activeIndex + historias.length - 1) % historias.length]
    : undefined;
  const next =
    activeIndex < historias.length - 1 ? historias[activeIndex + 1] : undefined;

  useEffect(() => {
    if (!current || isLoading || isLoadingMore || !hasAutomaticNext) return;

    const timeoutId = window.setTimeout(() => {
      if (activeIndex < totalSlides - 1) {
        setActiveIndex((index) => index + 1);
      } else if (nextCursor) {
        void loadNextPage();
      }
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, [
    activeIndex,
    current,
    hasAutomaticNext,
    isLoading,
    isLoadingMore,
    loadNextPage,
    nextCursor,
    totalSlides,
  ]);

  useEffect(() => {
    if (
      isLoading ||
      loadedFeed !== feed ||
      !current ||
      !localStorage.getItem("token-access")
    ) {
      return;
    }

    const viewKey = `${current.storyId}:${current.position}`;
    if (recordedViews.current.has(viewKey)) return;

    recordedViews.current.add(viewKey);
    void registerStoryVerseView(current.storyId, current.position).catch(
      () => {},
    );
  }, [current, feed, isLoading, loadedFeed]);

  return {
    current,
    previous,
    next,
    goPrevious,
    goNext,
    hasAutomaticNext,
    handleTouchStart,
    handleTouchEnd,
    error,
    needsAuthentication,
    pageError,
    setReloadKey,
    isLoadingMore,
    isLoading,
    touchStart,
    historias,
    nextCursor,
    loadNextPage
  };
};
