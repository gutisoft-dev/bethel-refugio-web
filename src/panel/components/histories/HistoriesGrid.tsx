import { Link } from "react-router-dom";
import type { HistoryFeed } from "./HistoriesHeader";
import { CardComponent } from "../CardComponent";
import { DetailsCard } from "../DetailsCard";
import { useAuthStore } from "@/auth/store/auth.store";
import { useHIstoriesGrid } from "@/panel/hooks/useHIstoriesGrid";
import {
  getFeedLabel,
  getStoryReference,
  getTimeAgo,
} from "@/panel/helpers/getAll";

interface HistoriesGridProps {
  feed?: HistoryFeed;
}

export const HistoriesGrid = ({ feed = "mine" }: HistoriesGridProps) => {
  const { authStatus } = useAuthStore();
  const {
    stories,
    nextCursor,
    isLoading,
    isLoadingMore,
    error,
    pageError,
    selectedStoryId,
    handleSelectedStoryId,
    handleStoryContentDeleted,
    loadNextPage,
    setReloadKey,
    scrollContainerRef,
    sentinelRef,
  } = useHIstoriesGrid({ feed });

  return (
    <section
      ref={scrollContainerRef}
      className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto  bg-slate-50 px-2 py-3 text-slate-900 sm:px-6 sm:py-5 lg:px-8"
      aria-label={
        feed === "mine"
          ? "Mis historias"
          : feed === "following"
            ? "Historias de seguidos"
            : "Historias públicas"
      }
      aria-busy={isLoading || isLoadingMore}
    >
      {isLoading ? (
        <p className="py-12 text-center text-sm text-slate-500" role="status">
          Cargando {getFeedLabel(feed)}…
        </p>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-slate-600" role="alert">
            {error}
          </p>
          {authStatus === "not-authenticated" && feed !== "public" ? (
            <Link
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              to="/auth/login"
            >
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
          {feed === "mine"
            ? "Aún no has publicado historias."
            : feed === "following"
              ? "Aún no hay historias de las personas que sigues."
              : "Aún no hay historias públicas."}
        </p>
      ) : (
        <>
          <div className="mx-auto grid w-[calc(100vw-1rem)] min-w-0 max-w-[calc(100vw-1rem)] grid-cols-2 gap-2 sm:w-full sm:max-w-6xl sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {stories.map((story) => {
              const sortedVerses = [...story.verses].sort(
                (a, b) => a.position - b.position,
              );
              const reference = getStoryReference(sortedVerses);
              const username =
                story.user?.username?.replace(/^@/, "").trim() || "Usuario";
              const timeAgo = getTimeAgo(story.created_at);
              const isExpired = story.status?.toLowerCase() === "expired";

              return (
                <CardComponent
                  key={story.id}
                  story={story}
                  isExpired={isExpired}
                  reference={reference}
                  username={username}
                  timeAgo={timeAgo}
                  handleSelectedStoryId={handleSelectedStoryId}
                />
              );
            })}
          </div>

          <div
            ref={sentinelRef}
            className="flex min-h-16 items-center justify-center py-5"
            aria-live="polite"
          >
            {isLoadingMore && (
              <p className="text-sm text-slate-500" role="status">
                Cargando más historias…
              </p>
            )}
            {pageError && !isLoadingMore && (
              <div className="flex items-center gap-3" role="alert">
                <span className="text-sm text-red-700">
                  No se pudieron cargar más historias.
                </span>
                <button
                  type="button"
                  onClick={() => void loadNextPage()}
                  className="text-sm font-semibold text-primary underline"
                >
                  Reintentar
                </button>
              </div>
            )}
            {!nextCursor && !isLoadingMore && (
              <p className="text-xs text-slate-400">
                Has llegado al final de las historias.
              </p>
            )}
          </div>
        </>
      )}
      <DetailsCard
        selectedStoryId={selectedStoryId}
        handleSelectedStoryId={handleSelectedStoryId}
        handleStoryContentDeleted={handleStoryContentDeleted}
        feed={feed}
        stories={stories}
        nextCursor={nextCursor}
      />
    </section>
  );
};
