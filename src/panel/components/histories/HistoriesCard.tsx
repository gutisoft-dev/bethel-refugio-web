import { Link } from "react-router-dom";
import { type PublicStory } from "@/panel/actions/history/story.action";
import type { HistoryFeed } from "./HistoriesHeader";
import { HistoriesViewsDialog } from "./HistoriesViewsDialog";
import { LeftSmall } from "@/icons/LeftSmall";
import { Book } from "@/icons/Book";
import { RightSmaill } from "@/icons/RightSmaill";
import { useDetailsHistory } from "@/panel/hooks/useDetailsHistory";
import { getVerseFontSize } from "@/panel/helpers/getAll";

interface HistoriasCardsProps {
  feed?: HistoryFeed;
  initialStoryId?: string;
  initialStories?: PublicStory[];
  initialCursor?: string | null;
}

export const HistoriasCards = ({
  feed = "public",
  initialStoryId,
  initialStories,
  initialCursor,
}: HistoriasCardsProps) => {
  const {
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
    isLoading,
    isLoadingMore,
    touchStart,
    historias,
    nextCursor,
    loadNextPage,
  } = useDetailsHistory({
    feed,
    initialStoryId,
    initialStories,
    initialCursor,
  });
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
              <LeftSmall />
            </button>

            <article
              aria-label={`Historia de ${current.author}: ${current.reference}`}
              className="histories-grid-card relative flex h-[min(800px,100%)] max-h-[800px] min-h-0 w-[min(448px,calc(100vw-32px))] shrink-0 flex-col overflow-hidden rounded-[2rem] border border-primary/40 bg-slate-950 p-0 text-primary-foreground shadow-2xl"
            >
              <span
                className="histories-grid-card-overlay pointer-events-none absolute inset-0 opacity-90"
                aria-hidden="true"
              />
              <div
                className="absolute inset-x-5 top-5 z-10 flex gap-1.5"
                aria-label="Progreso de la historia"
              >
                {Array.from({ length: current.totalVerses }).map((_, index) => (
                  <span
                    key={`${current.id}-${index}`}
                    className="h-0.75 flex-1 overflow-hidden rounded-full bg-white/25"
                  >
                    {index < current.position - 1 ? (
                      <span className="block h-full w-full rounded-full bg-white" />
                    ) : index === current.position - 1 ? (
                      <span className="block h-full origin-left rounded-full bg-white animate-[story-progress_10s_linear_forwards]" />
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
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-3.5 shrink-0"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span className="truncate">
                        @{current.username} · {current.elapsed}
                      </span>
                    </p>
                  </div>
                </div>
              </header>

              <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end overflow-y-auto px-6 pb-8 pt-6 text-left [scrollbar-color:rgba(255,255,255,0.3)_transparent] scrollbar-thin sm:px-8 sm:pb-12">
                <span className="mb-5 inline-flex max-w-full items-center gap-2 self-start rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  <Book />
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
                <RightSmaill />
              </button>
            )}

            {(historias.length > 1 || nextCursor) &&
              (next ? (
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
              ))}
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
