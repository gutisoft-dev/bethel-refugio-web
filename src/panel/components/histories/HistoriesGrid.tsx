import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  getFollowingStories,
  getMyStories,
  getStoriesPublic,
  type PublicStory,
} from "@/panel/actions/history/story.action";
import { HistoriesCard } from "./HistoriesCard";
import type { HistoryFeed } from "./HistoriesHeader";

interface HistoriesGridProps {
  feed?: HistoryFeed;
}

interface StoriesPage {
  results: PublicStory[];
  next: string | null;
}

const getFeedLabel = (feed: HistoryFeed) =>
  feed === "mine" ? "tus historias" : feed === "following" ? "historias de las personas que sigues" : "historias públicas";

const getTimeAgo = (createdAt: string) => {
  const createdAtMs = Date.parse(createdAt);
  if (Number.isNaN(createdAtMs)) return "";

  const minutes = Math.max(0, Math.floor((Date.now() - createdAtMs) / 60_000));
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "Hace 1 h" : `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "Hace 1 día" : `Hace ${days} días`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "Hace 1 sem" : `Hace ${weeks} sem`;
};

const getStoryReference = (verses: PublicStory["verses"]) => {
  const first = verses[0]?.verse.reference;
  const last = verses.at(-1)?.verse.reference;
  if (!first || !last || verses.length < 2) return first ?? "Historia";

  const firstMatch = first.match(/^(.+?\s+\d+):(\d+)$/);
  const lastMatch = last.match(/^(.+?\s+\d+):(\d+)$/);
  if (firstMatch && lastMatch && firstMatch[1] === lastMatch[1]) {
    return `${firstMatch[1]}:${firstMatch[2]}-${lastMatch[2]}`;
  }

  return `${first}–${last}`;
};

const loadStoriesPage = (feed: HistoryFeed, cursor?: string): Promise<StoriesPage> =>
  feed === "mine"
    ? getMyStories(cursor)
    : feed === "following"
      ? getFollowingStories(cursor)
      : getStoriesPublic(cursor);

export const HistoriesGrid = ({ feed = "mine" }: HistoriesGridProps) => {
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

      if (feed !== "public" && !localStorage.getItem("token-access")) {
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

  return (
    <section
      ref={scrollContainerRef}
      className="min-h-0 w-full flex-1 overflow-y-auto overscroll-contain bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8"
      aria-label={feed === "mine" ? "Mis historias" : feed === "following" ? "Historias de seguidos" : "Historias públicas"}
      aria-busy={isLoading || isLoadingMore}
    >
      {isLoading ? (
        <p className="py-12 text-center text-sm text-slate-500" role="status">
          Cargando {getFeedLabel(feed)}…
        </p>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-slate-600" role="alert">{error}</p>
          {!localStorage.getItem("token-access") && feed !== "public" ? (
            <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" to="/auth/login">
              Iniciar sesión
            </Link>
          ) : (
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Reintentar
            </button>
          )}
        </div>
      ) : stories.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">
          {feed === "mine" ? "Aún no has publicado historias." : feed === "following" ? "Aún no hay historias de las personas que sigues." : "Aún no hay historias públicas."}
        </p>
      ) : (
        <>
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stories.map((story) => {
              const sortedVerses = [...story.verses].sort((a, b) => a.position - b.position);
              const reference = getStoryReference(sortedVerses);
              const username = story.user?.username?.replace(/^@/, "").trim() || "Usuario";
              const timeAgo = getTimeAgo(story.created_at);
              const isExpired = story.status?.toLowerCase() === "expired";

              return (
                <article
                  key={story.id}
                  role={isExpired ? undefined : "button"}
                  tabIndex={isExpired ? undefined : 0}
                  aria-disabled={isExpired || undefined}
                  aria-label={`${isExpired ? "Historia bloqueada" : "Abrir historia"}: ${reference}`}
                  onClick={isExpired ? undefined : () => setSelectedStoryId(story.id)}
                  onKeyDown={(event) => {
                    if (isExpired) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedStoryId(story.id);
                    }
                  }}
                  className={`histories-grid-card group relative aspect-[3/4] w-full overflow-hidden rounded-[1.35rem] border border-primary-foreground/15 p-4 text-left text-primary-foreground transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 ${isExpired ? "cursor-not-allowed opacity-55 grayscale" : "cursor-pointer hover:-translate-y-1 hover:border-primary-foreground/35"}`}
                >
                  <span className="histories-grid-card-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
                  {isExpired && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                      Bloqueada
                    </span>
                  )}
                  <div className="relative flex h-full flex-col justify-between">
                    <div className={`flex min-w-0 items-center gap-2 ${isExpired ? "pr-20" : ""}`}>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold ring-1 ring-white/50 backdrop-blur-sm">
                        {username.slice(0, 2).toLocaleUpperCase("es")}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">@{username}</span>
                        {timeAgo && (
                          <span className="flex items-center gap-1 text-xs text-white/75">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3 shrink-0">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            {timeAgo}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-1.5 text-base font-semibold text-white">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
                        <path d="M12 7v14" />
                        <path d="M3 18V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13" />
                        <path d="M3 18a3 3 0 0 1 3-3h15" />
                      </svg>
                      <span className="truncate">{reference}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div ref={sentinelRef} className="flex min-h-16 items-center justify-center py-5" aria-live="polite">
            {isLoadingMore && <p className="text-sm text-slate-500" role="status">Cargando más historias…</p>}
            {pageError && !isLoadingMore && (
              <div className="flex items-center gap-3" role="alert">
                <span className="text-sm text-red-700">No se pudieron cargar más historias.</span>
                <button type="button" onClick={() => void loadNextPage()} className="text-sm font-semibold text-primary underline">Reintentar</button>
              </div>
            )}
            {!nextCursor && !isLoadingMore && <p className="text-xs text-slate-400">Has llegado al final de las historias.</p>}
          </div>
        </>
      )}
      <Dialog
        open={selectedStoryId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedStoryId(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/85 backdrop-blur-xl supports-backdrop-filter:backdrop-blur-xl"
          className="!fixed !inset-0 !left-0 !top-0 !z-[60] !grid !h-dvh !w-screen !max-w-none !translate-x-0 !translate-y-0 !gap-0 !rounded-none !border-0 !bg-transparent !p-0 !text-white !shadow-none !ring-0 sm:!max-w-none"
        >
          <DialogTitle className="sr-only">Historia</DialogTitle>
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cerrar historia"
                className="absolute right-5 top-5 z-[70] size-11 rounded-full bg-black/70 text-white ring-1 ring-white/20 transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-8 sm:top-8"
              />
            }
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </DialogClose>
          {selectedStoryId && (
            <HistoriesCard
              key={`${feed}-${selectedStoryId}`}
              feed={feed}
              initialStoryId={selectedStoryId}
              initialStories={stories}
              initialCursor={nextCursor}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
