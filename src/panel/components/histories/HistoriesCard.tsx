import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  getFollowingStories,
  getMyStories,
  getStoriesPublic,
  registerStoryVerseView,
  type PublicStory,
} from "@/panel/actions/history/story.action";
import type { HistoryFeed } from "./HistoriesHeader";
import { HistoriesViewsDialog } from "./HistoriesViewsDialog";

interface Historia {
  id: string;
  storyId: string;
  initials: string;
  author: string;
  username: string;
  reference: string;
  verse: string;
  description: string | null;
  position: number;
  totalVerses: number;
  remaining: string;
  favorites: number;
  reactions: number;
  views: number;
  visibility?: "public" | "followers";
  status?: string;
}

interface HistoriasCardsProps {
  feed?: HistoryFeed;
}

interface StoriesApiError {
  detail?: string;
  message?: string;
  error?: { message?: string };
}

const getRemainingTime = (expiresAt: string) => {
  const expiresAtMs = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtMs)) return "Historia pública";

  const remainingHours = Math.max(
    0,
    Math.ceil((expiresAtMs - Date.now()) / (1000 * 60 * 60)),
  );

  return `Quedan ${remainingHours}h`;
};

const getVerseFontSize = (text: string) =>
  Math.max(12, Math.min(22, 22 * Math.sqrt(180 / Math.max(180, text.length))));

const toSlides = (stories: PublicStory[], isMine = false): Historia[] =>
  stories.flatMap((story) => {
    const username =
      story.user?.username.replace(/^@/, "").trim() ||
      (isMine ? "Tú" : "usuario");
    const author = isMine ? "Mi historia" : username;
    const initials = isMine
      ? "TÚ"
      : username.slice(0, 2).toLocaleUpperCase("es");
    const verses = [...story.verses].sort(
      (first, second) => first.position - second.position,
    );

    return verses.map((item, index) => ({
      id: `${story.id}-${item.position}`,
      storyId: story.id,
      initials,
      author,
      username,
      reference: item.verse.reference || item.verse.normalized_reference,
      verse: item.verse.text,
      description: item.caption,
      position: item.position || index + 1,
      totalVerses: verses.length,
      remaining: getRemainingTime(story.expires_at),
      favorites: item.count_favorite,
      reactions: item.count_reaction,
      views: item.views_count,
      visibility: story.visibility,
      status: story.status,
    }));
  });

export const HistoriasCards = ({ feed = "public" }: HistoriasCardsProps) => {
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

        setHistorias(toSlides(response.results, feed === "mine"));
        setNextCursor(response.next);
        setActiveIndex(0);
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
  }, [feed, reloadKey]);

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
    } else {
      setActiveIndex(0);
    }
  }, [activeIndex, feed, loadNextPage, nextCursor, totalSlides]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button, a, [role='dialog']")) {
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
  const next = historias.length
    ? historias[(activeIndex + 1) % historias.length]
    : undefined;

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

    // Guard before the request so React Strict Mode and rapid navigation cannot duplicate it.
    recordedViews.current.add(viewKey);
    void registerStoryVerseView(current.storyId, current.position).catch(() => {
      // View tracking must not interrupt story playback if the request fails.
    });
  }, [current, feed, isLoading, loadedFeed]);

  return (
    <section
      className="relative flex h-full min-h-0 w-full flex-col justify-center overflow-hidden bg-slate-50 px-2 py-3 text-slate-900 sm:px-4"
      aria-label={
        feed === "mine"
          ? "Mis historias"
          : feed === "following"
            ? "Historias de usuarios que sigues"
            : "Historias bíblicas públicas"
      }
      aria-busy={isLoading || isLoadingMore}
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center" role="status">
          <p className="text-sm font-medium text-slate-600">
            {feed === "mine"
              ? "Cargando tus historias…"
              : feed === "following"
                ? "Cargando historias de quienes sigues…"
                : "Cargando historias públicas…"}
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-slate-700" role="alert">
            {error}
          </p>
          {needsAuthentication ? (
            <Link
              to="/auth/login"
              className="rounded-md bg-purple-700 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
            >
              Iniciar sesión
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-md bg-purple-700 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
            >
              Reintentar
            </button>
          )}
        </div>
      ) : !current ? (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-sm text-slate-600">
            {feed === "mine"
              ? "Aún no has publicado historias."
              : feed === "following"
                ? "Aún no hay historias de las personas que sigues."
                : "Aún no hay historias públicas para mostrar."}
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 w-full flex-1 items-center justify-center px-1 sm:px-2">
          <div
            className="flex h-full w-full touch-pan-y items-center justify-center gap-2 sm:gap-4 lg:gap-5"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => {
              touchStart.current = null;
            }}
          >
            {historias.length > 1 && previous && (
              <button
                type="button"
                onClick={goPrevious}
                aria-label={`Ver historia anterior de ${previous.author}`}
                className="group relative hidden h-[min(420px,100%)] w-[min(165px,18vw)] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1022]/70 p-3 text-left text-white opacity-50 transition hover:opacity-80 lg:flex"
              >
                <span className="flex items-center gap-2 text-[9px] font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-[8px] text-slate-900">
                    {previous.initials}
                  </span>
                  <span className="truncate">{previous.author}</span>
                </span>
                <span className="mt-1 text-[8px] text-white/50">
                  {previous.reference}
                </span>
                <span className="mt-auto line-clamp-3 text-center text-[10px] italic text-white/60">
                  “{previous.verse}”
                </span>
                <span className="mt-8 rounded-full bg-black/20 px-2 py-1 text-center text-[8px] text-white/60">
                  Anterior
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={goPrevious}
              aria-label="Historia anterior"
              disabled={historias.length < 2}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <article
              aria-label={`Historia de ${current.author}: ${current.reference}`}
              className="relative flex h-[min(590px,100%)] min-h-0 w-[min(390px,calc(100vw-28px))] shrink-0 flex-col overflow-hidden rounded-[22px] border border-purple-300/30 bg-linear-to-b from-[#310b48] via-[#4c0877] to-[#110c17] text-white shadow-[0_0_38px_rgba(98,24,145,0.24)]"
            >
              <div className="flex gap-1 px-3 pt-2.5" aria-hidden="true">
                {Array.from({ length: current.totalVerses }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-0.75 flex-1 rounded-full ${index < current.position ? "bg-white" : "bg-white/25"}`}
                  />
                ))}
              </div>

              <header className="flex items-center justify-between gap-2 px-3 pt-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-purple-300 bg-white/10 text-[10px] font-bold">
                    {current.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold">
                      {current.author}
                    </p>
                    <p className="truncate text-[8px] text-white/60">
                      {feed === "mine"
                        ? `${current.visibility === "followers" ? "Seguidores" : "Pública"} · ${current.status === "active" ? "Activa" : (current.status ?? "Historia")} · ${current.remaining}`
                        : `@${current.username} · ${current.remaining}`}
                    </p>
                  </div>
                </div>
              </header>

              <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-8 pb-2 text-center [scrollbar-color:rgba(255,255,255,0.3)_transparent] scrollbar-thin">
                <span className="mb-4 inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-purple-200/20 bg-purple-200/10 px-3 py-1 text-[9px] font-semibold text-purple-100">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3 w-3 shrink-0 text-amber-300"
                  >
                    <path d="M7.17 6A4.17 4.17 0 0 0 3 10.17V18h7v-7H6.2A1.2 1.2 0 0 1 7.4 9.8H9V6H7.17Zm10 0A4.17 4.17 0 0 0 13 10.17V18h7v-7h-3.8a1.2 1.2 0 0 1 1.2-1.2H19V6h-1.83Z" />
                  </svg>
                  {current.reference}
                </span>
                <div className="relative pr-5">
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 left-0 text-3xl font-black text-purple-200/40"
                  >
                    ”
                  </span>
                  <blockquote
                    className="font-serif font-semibold italic leading-tight text-white transition-[font-size] duration-200"
                    style={{ fontSize: `${getVerseFontSize(current.verse)}px` }}
                  >
                    “{current.verse}”
                  </blockquote>
                </div>
                {current.description && (
                  <>
                    <div className="my-4 h-px w-10 bg-purple-200/30" />
                    <p className="max-w-72.5 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-[12px] leading-[1.45] text-white/85">
                      {current.description}
                    </p>
                  </>
                )}
                {feed === "mine" && (
                  <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] text-white/70">
                    <span>♡ {current.favorites} favoritos</span>
                    <span>♥ {current.reactions} reacciones</span>
                    <HistoriesViewsDialog
                      storyId={current.storyId}
                      position={current.position}
                      reference={current.reference}
                      count={current.views}
                    />
                  </div>
                )}
              </div>
            </article>

            <button
              type="button"
              onClick={goNext}
              aria-label="Historia siguiente"
              disabled={(historias.length < 2 && !nextCursor) || isLoadingMore}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {historias.length > 1 && next && (
              <button
                type="button"
                onClick={goNext}
                aria-label={`Ver historia siguiente de ${next.author}`}
                className="group relative hidden h-[min(420px,100%)] w-[min(165px,18vw)] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1022]/70 p-3 text-left text-white opacity-50 transition hover:opacity-80 lg:flex"
              >
                <span className="flex items-center gap-2 text-[9px] font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-[8px] text-slate-900">
                    {next.initials}
                  </span>
                  <span className="truncate">{next.author}</span>
                </span>
                <span className="mt-1 text-[8px] text-white/50">
                  {next.reference}
                </span>
                <span className="mt-auto line-clamp-3 text-center text-[10px] italic text-white/60">
                  “{next.verse}”
                </span>
                <span className="mt-8 rounded-full bg-black/20 px-2 py-1 text-center text-[8px] text-white/60">
                  Siguiente
                </span>
              </button>
            )}
          </div>
        </div>
      )}
      {pageError && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-red-700 shadow-md">
          <span role="alert">No se pudieron cargar más historias.</span>
          <button
            type="button"
            onClick={() => void loadNextPage()}
            className="font-semibold underline"
          >
            Reintentar
          </button>
        </div>
      )}
      {isLoadingMore && (
        <p
          className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-white/95 px-3 py-2 text-xs text-slate-600 shadow-md"
          role="status"
        >
          Cargando más historias…
        </p>
      )}
    </section>
  );
};

export { HistoriasCards as HistoriesCard };
