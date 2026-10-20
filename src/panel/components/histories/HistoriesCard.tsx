import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { PublicStory } from "@/panel/actions/history/story.action";
import type { HistoryFeed } from "./HistoriesHeader";
import { useAuthStore } from "@/auth/store/auth.store";
import { useDetailsHistory } from "@/panel/hooks/useDetailsHistory";
import { useDownloadStoryVerseImage } from "@/panel/hooks/useDownloadStoryVerseImage";
import { useHistoryDeletion } from "@/panel/hooks/useHistoryDeletion";
import { LeftSmall } from "@/icons/LeftSmall";
import { RightSmaill } from "@/icons/RightSmaill";
import { HistoryPreviewCard } from "./HistoryPreviewCard";
import { HistoryViewerCard } from "./HistoryViewerCard";
import { DeleteHistoryDialog } from "./DeleteHistoryDialog";

interface HistoriasCardsProps {
  feed?: HistoryFeed;
  initialStoryId?: string;
  initialStories?: PublicStory[];
  initialCursor?: string | null;
  onStoryContentDeleted?: (storyId: string, position?: number) => void;
}

const getFeedAriaLabel = (feed: HistoryFeed) => {
  if (feed === "mine") return "Mis historias";
  if (feed === "following") return "Historias de usuarios que sigues";
  return "Historias bíblicas públicas";
};

const getLoadingMessage = (feed: HistoryFeed) => {
  if (feed === "mine") return "Cargando tus historias…";
  if (feed === "following") return "Cargando historias de quienes sigues…";
  return "Cargando historias públicas…";
};

const getEmptyMessage = (feed: HistoryFeed) => {
  if (feed === "mine") return "Aún no has publicado historias.";
  if (feed === "following") return "Aún no hay historias de las personas que sigues.";
  return "Aún no hay historias públicas para mostrar.";
};

export const HistoriasCards = ({
  feed = "public",
  initialStoryId,
  initialStories,
  initialCursor,
  onStoryContentDeleted,
}: HistoriasCardsProps) => {
  const navigate = useNavigate();
  const { authStatus } = useAuthStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewsDialogOpen, setIsViewsDialogOpen] = useState(false);
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
    removeStoryContent,
  } = useDetailsHistory({
    feed,
    initialStoryId,
    initialStories,
    initialCursor,
    isPaused: isDeleteDialogOpen || isViewsDialogOpen,
  });
  const deletion = useHistoryDeletion({
    current,
    stories: historias,
    isDialogOpen: isDeleteDialogOpen,
    setIsDialogOpen: setIsDeleteDialogOpen,
    onRemoveStoryContent: removeStoryContent,
    onStoryContentDeleted,
  });
  const { isDownloading, downloadImage } = useDownloadStoryVerseImage();
  const isStoryTimerPaused = deletion.isDialogOpen || isViewsDialogOpen;

  const navigateToProfile = (username: string) => {
    if (username !== "Mi historia") navigate(`/profile/${username}`);
  };

  const retryLoading = () => setReloadKey((key) => key + 1);

  return (
    <section
      className="relative flex h-full min-h-0 w-full flex-col justify-center overflow-hidden bg-transparent px-0 py-0 text-slate-900"
      aria-label={getFeedAriaLabel(feed)}
      aria-busy={isLoading || isLoadingMore}
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center" role="status">
          <p className="text-sm font-medium text-slate-600">
            {getLoadingMessage(feed)}
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
              onClick={retryLoading}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Reintentar
            </button>
          )}
        </div>
      ) : !current ? (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-sm text-slate-600">{getEmptyMessage(feed)}</p>
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
              <HistoryPreviewCard
                story={previous}
                label="Anterior"
                onClick={goPrevious}
              />
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

            <HistoryViewerCard
              story={current}
              feed={feed}
              isAuthenticated={authStatus === "authenticated"}
              isDeleting={deletion.isDeleting}
              isDownloading={isDownloading}
              isTimerPaused={isStoryTimerPaused}
              onDeleteClick={() => {
                deletion.clearError();
                deletion.setIsDialogOpen(true);
              }}
              onNavigateToProfile={navigateToProfile}
              onViewsDialogOpenChange={setIsViewsDialogOpen}
              onDownload={() =>
                void downloadImage(
                  current.storyId,
                  current.position,
                  current.reference,
                )
              }
            />

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
                <HistoryPreviewCard
                  story={next}
                  label="Siguiente"
                  onClick={goNext}
                />
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

      {feed === "mine" && current && (
        <DeleteHistoryDialog
          open={deletion.isDialogOpen}
          isDeleting={deletion.isDeleting}
          error={deletion.error}
          hasMultipleVerses={deletion.hasMultipleVerses}
          canDeleteCurrentVerse={deletion.canDeleteCurrentVerse}
          onOpenChange={deletion.setIsDialogOpen}
          onClearError={deletion.clearError}
          onDeleteStory={() => void deletion.handleDelete("story")}
          onDeleteVerse={() => void deletion.handleDelete("verse")}
        />
      )}
    </section>
  );
};

export { HistoriasCards as HistoriesCard };
