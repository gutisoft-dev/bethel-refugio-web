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
  elapsed: string;
  favorites: number;
  reactions: number;
  views: number;
  visibility?: "public" | "followers";
  status?: string;
}

interface HistoriasCardsProps {
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

const getRemainingTime = (expiresAt: string) => {
  const expiresAtMs = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtMs)) return "Historia pública";

  const remainingHours = Math.max(
    0,
    Math.ceil((expiresAtMs - Date.now()) / (1000 * 60 * 60)),
  );

  return `Quedan ${remainingHours}h`;
};

const getElapsedTime = (createdAt: string) => {
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

const getVerseFontSize = (text: string) =>
  Math.max(16, Math.min(36, 36 * Math.sqrt(100 / Math.max(100, text.length))));

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
      elapsed: getElapsedTime(story.created_at),
      favorites: item.count_favorite,
      reactions: item.count_reaction,
      views: item.views_count,
      visibility: story.visibility,
      status: story.status,
    }));
  });

export const HistoriasCards = ({
  feed = "public",
  initialStoryId,
  initialStories,
  initialCursor,
}: HistoriasCardsProps) => {
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

  const hasAutomaticNext =
    activeIndex < totalSlides - 1 || Boolean(nextCursor);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    // HistoriesCard can itself be rendered inside a dialog (for example from
    // HistoriesGrid). Only skip gestures that start on an interactive control;
    // checking for any dialog ancestor disables swiping for the whole card.
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
  const next = activeIndex < historias.length - 1
    ? historias[activeIndex + 1]
    : undefined;

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

    // Guard before the request so React Strict Mode and rapid navigation cannot duplicate it.
    recordedViews.current.add(viewKey);
    void registerStoryVerseView(current.storyId, current.position).catch(() => {
      // View tracking must not interrupt story playback if the request fails.
    });
  }, [current, feed, isLoading, loadedFeed]);

  return (
    <section
      className="relative flex h-full min-h-0 w-full flex-col justify-center overflow-hidden bg-transparent px-0 py-0 text-slate-900"
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
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Iniciar sesión
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
            className="relative flex h-full w-full touch-pan-y items-center justify-center gap-2 sm:gap-4 lg:gap-5"
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
              className="histories-grid-card group relative hidden h-[min(520px,100%)] w-[min(195px,18vw)] shrink-0 flex-col overflow-hidden rounded-xl border border-primary-foreground/10 p-3 text-left text-primary-foreground opacity-50 transition hover:opacity-80 lg:flex"
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
            {historias.length <= 1 && nextCursor && (
              <div
                aria-hidden="true"
                className="invisible relative hidden h-[min(520px,100%)] w-[min(195px,18vw)] shrink-0 lg:flex"
              />
            )}

            <button
              type="button"
              onClick={goPrevious}
              aria-label="Historia anterior"
              disabled={historias.length < 2}
              className="absolute left-3 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white ring-1 ring-white/20 transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-30 sm:flex sm:left-8"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <article
              aria-label={`Historia de ${current.author}: ${current.reference}`}
              className="histories-grid-card relative flex h-[min(800px,100%)] max-h-[800px] min-h-0 w-[min(448px,calc(100vw-32px))] shrink-0 flex-col overflow-hidden rounded-[2rem] border border-primary/40 bg-slate-950 p-0 text-primary-foreground shadow-2xl"
            >
              <span className="histories-grid-card-overlay pointer-events-none absolute inset-0 opacity-90" aria-hidden="true" />
              <div className="absolute inset-x-5 top-5 z-10 flex gap-1.5" aria-label="Progreso de la historia">
                {Array.from({ length: current.totalVerses }).map((_, index) => (
                  <span
                    key={`${current.id}-${index}`}
                    className="h-0.75 flex-1 overflow-hidden rounded-full bg-white/25"
                  >
                    {index < current.position - 1 ? (
                      <span className="block h-full w-full rounded-full bg-white" />
                    ) : index === current.position - 1 ? (
                      <span
                        className="block h-full origin-left rounded-full bg-white animate-[story-progress_10s_linear_forwards]"
                      />
                    ) : null}
                  </span>
                ))}
              </div>

              <header className="relative z-10 flex items-center justify-between gap-2 px-6 pt-12 sm:px-8 sm:pt-14">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold ring-1 ring-white/60 backdrop-blur-sm">
                    {current.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {current.author}
                    </p>
                    <p className="flex min-w-0 items-center gap-1 truncate text-xs text-white/70">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span className="truncate">@{current.username} · {current.elapsed}</span>
                    </p>
                  </div>
                </div>
              </header>

              <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end overflow-y-auto px-6 pb-8 pt-6 text-left [scrollbar-color:rgba(255,255,255,0.3)_transparent] scrollbar-thin sm:px-8 sm:pb-12">
                <span className="mb-5 inline-flex max-w-full items-center gap-2 self-start rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 shrink-0"
                  >
                    <path d="M12 7v14" />
                    <path d="M3 18V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13" />
                    <path d="M3 18a3 3 0 0 1 3-3h15" />
                  </svg>
                  {current.reference}
                </span>
                <blockquote
                  className="font-semibold leading-tight tracking-tight text-white transition-[font-size] duration-200 sm:leading-[1.12]"
                  style={{ fontSize: `${getVerseFontSize(current.verse)}px` }}
                >
                  {current.verse}
                </blockquote>
                {current.description && (
                  <>
                    <p className="mt-5 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-white/85">
                      {current.description}
                    </p>
                  </>
                )}
                {feed === "mine" && (
                  <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/75">
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

            {hasAutomaticNext && (
              <button
                type="button"
                onClick={goNext}
                aria-label="Historia siguiente"
                disabled={isLoadingMore}
                className="absolute right-3 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white ring-1 ring-white/20 transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-30 sm:flex sm:right-8"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            )}

            {(historias.length > 1 || nextCursor) && (
              next ? (
                <button
                type="button"
                onClick={goNext}
                aria-label={`Ver historia siguiente de ${next.author}`}
                className="histories-grid-card group relative hidden h-[min(520px,100%)] w-[min(195px,18vw)] shrink-0 flex-col overflow-hidden rounded-xl border border-primary-foreground/10 p-3 text-left text-primary-foreground opacity-50 transition hover:opacity-80 lg:flex"
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
              ) : (
                <div
                  aria-hidden="true"
                  className="invisible relative hidden h-[min(520px,100%)] w-[min(195px,18vw)] shrink-0 lg:flex"
                />
              )
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
