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

const getInitials = (username: string) =>
  username.slice(0, 2).toLocaleUpperCase("es");

const getTimeAgo = (date: string) => {
  const timestamp = Date.parse(date);
  if (Number.isNaN(timestamp)) return "";

  const days = Math.floor((Date.now() - timestamp) / 86_400_000);
  if (days < 1) return "Hace menos de un día";
  if (days === 1) return "Hace 1 día";
  if (days < 7) return `Hace ${days} días`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? "Hace 1 sem" : `Hace ${weeks} sem`;
  const months = Math.floor(days / 30);
  return months === 1 ? "Hace 1 mes" : `Hace ${months} meses`;
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
            <Link className="rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white" to="/auth/login">
              Iniciar sesión
            </Link>
          ) : (
            <button
              type="button"
              className="rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800"
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
          <div className="mx-auto grid w-full max-w-375 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {stories.map((story) => {
              const sortedVerses = [...story.verses].sort((a, b) => a.position - b.position);
              const firstVerse = sortedVerses[0];
              const username = story.user?.username?.replace(/^@/, "") || "Usuario";
              const views = sortedVerses.reduce((total, verse) => total + (verse.views_count ?? 0), 0);

              return (
                <article
                  key={story.id}
                  className="group flex min-h-65 flex-col rounded-[22px] border border-purple-300/15 bg-linear-to-br from-[#260b38] via-[#321044] to-[#100b16] p-5 text-purple-50 shadow-[0_12px_32px_rgba(30,10,45,0.14)] transition duration-200 hover:-translate-y-0.5 hover:border-purple-300/35 hover:shadow-[0_16px_38px_rgba(76,8,119,0.2)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-purple-200/20 bg-purple-200/15 px-3 py-1.5 text-xs font-bold tracking-wide text-purple-100">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
                        <path d="M6 4h12v17l-6-4-6 4z" />
                      </svg>
                      <span className="truncate">{firstVerse?.verse.reference ?? "Historia"}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-sm text-purple-200/60" aria-label={`${views} visualizaciones`}>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {Intl.NumberFormat("es", { notation: "compact", maximumFractionDigits: 1 }).format(views)}
                    </span>
                  </div>

                  <div className="mt-5 flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-900">
                      {getInitials(username)}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-bold text-white">{username}</h2>
                      <p className="truncate text-sm text-purple-100/50">
                        @{username}{getTimeAgo(story.created_at) ? ` · ${getTimeAgo(story.created_at)}` : ""}
                      </p>
                    </div>
                  </div>

                  {firstVerse ? (
                    <blockquote className="mt-5 line-clamp-2 font-serif text-lg font-semibold italic leading-snug text-purple-50/90">
                      «{firstVerse.verse.text}»
                    </blockquote>
                  ) : (
                    <p className="mt-5 text-sm text-purple-100/60">Esta historia no tiene versículos.</p>
                  )}

                  <div className="mt-auto pt-5">
                    <div className="mb-3 h-px bg-purple-100/10" />
                    <button
                      type="button"
                      onClick={() => setSelectedStoryId(story.id)}
                      className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-purple-100 transition hover:text-white"
                    >
                      <span>Ver historia</span>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform group-hover:translate-x-0.5">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </button>
                    {story.visibility && (
                      <span className="sr-only">{story.visibility === "public" ? "Pública" : "Visible para seguidores"}</span>
                    )}
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
                <button type="button" onClick={() => void loadNextPage()} className="text-sm font-semibold text-purple-700 underline">Reintentar</button>
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
          overlayClassName="bg-black/65 backdrop-blur-md"
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
                className="absolute right-4 top-4 z-[70] rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white"
              />
            }
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
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
