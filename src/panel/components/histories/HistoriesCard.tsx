import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { type PublicStory } from "@/panel/actions/history/story.action";
import type { HistoryFeed } from "./HistoriesHeader";
import { HistoriesViewsDialog } from "./HistoriesViewsDialog";
import { LeftSmall } from "@/icons/LeftSmall";
import { Book } from "@/icons/Book";
import { RightSmaill } from "@/icons/RightSmaill";
import { useDetailsHistory } from "@/panel/hooks/useDetailsHistory";
import { useDeleteStory } from "@/panel/hooks/useDeleteStory";
import { useDownloadStoryVerseImage } from "@/panel/hooks/useDownloadStoryVerseImage";
import { useAuthStore } from "@/auth/store/auth.store";
import { getVerseFontSize } from "@/panel/helpers/getAll";

interface HistoriasCardsProps {
  feed?: HistoryFeed;
  initialStoryId?: string;
  initialStories?: PublicStory[];
  initialCursor?: string | null;
  onStoryContentDeleted?: (storyId: string, position?: number) => void;
}

export const HistoriasCards = ({
  feed = "public",
  initialStoryId,
  initialStories,
  initialCursor,
  onStoryContentDeleted,
}: HistoriasCardsProps) => {
  const { authStatus } = useAuthStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { isDeleting, error: deleteError, clearError, removeStory, removeVerse } = useDeleteStory();
  const { isDownloading, downloadImage } = useDownloadStoryVerseImage();
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
    isPaused: isDeleteDialogOpen,
  });

  const currentStorySlides = current
    ? historias.filter((story) => story.storyId === current.storyId)
    : [];
  const hasMultipleVerses = currentStorySlides.length > 1;
  const lastVersePosition = currentStorySlides.reduce(
    (lastPosition, story) => Math.max(lastPosition, story.position),
    0,
  );
  const canDeleteCurrentVerse =
    hasMultipleVerses && current?.position === lastVersePosition;

  const handleDelete = async (target: "verse" | "story") => {
    if (!current || isDeleting) return;
    if (target === "verse" && !canDeleteCurrentVerse) return;

    const deleted =
      target === "verse"
        ? await removeVerse(current.storyId, current.position)
        : await removeStory(current.storyId);

    if (!deleted) return;

    if (target === "verse") {
      removeStoryContent(current.storyId, current.position);
      onStoryContentDeleted?.(current.storyId, current.position);
      toast.add({
        type: "success",
        description: `Se eliminó el versículo ${current.reference}.`,
        priority: "high",
        timeout: 3500,
      });
    } else {
      removeStoryContent(current.storyId);
      onStoryContentDeleted?.(current.storyId);
      toast.add({
        type: "success",
        description: "Se eliminó la historia completa.",
        priority: "high",
        timeout: 3500,
      });
    }

    setIsDeleteDialogOpen(false);
  };

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
                {feed === "mine" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Eliminar la historia de ${current.reference}`}
                    title="Eliminar historia o versículo"
                    disabled={isDeleting || current.status?.toLowerCase() === "expired"}
                    onClick={() => {
                      clearError();
                      setIsDeleteDialogOpen(true);
                    }}
                    className="size-9 shrink-0 rounded-full text-white/80 hover:bg-red-500/20 hover:text-red-200 focus-visible:ring-white"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                      <path d="M10 11v5M14 11v5" />
                    </svg>
                  </Button>
                )}
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
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/75">
                  {feed === "mine" && (
                    <>
                    <span>♡ {current.favorites} favoritos</span>
                    <span>♥ {current.reactions} reacciones</span>
                    <HistoriesViewsDialog
                      storyId={current.storyId}
                      position={current.position}
                      reference={current.reference}
                      count={current.views}
                    />
                    </>
                  )}
                  {authStatus === "authenticated" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Descargar imagen de ${current.reference}`}
                      title="Descargar imagen para compartir"
                      disabled={isDownloading}
                      aria-busy={isDownloading}
                      onClick={() =>
                        void downloadImage(
                          current.storyId,
                          current.position,
                          current.reference,
                        )
                      }
                      className="ml-auto rounded-full text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white"
                    >
                      {isDownloading ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-4 animate-spin"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      ) : (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M12 15V3" />
                      </svg>
                      )}
                    </Button>
                  )}
                </div>
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
      {feed === "mine" && current && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            if (isDeleting) return;
            setIsDeleteDialogOpen(open);
            if (!open) clearError();
          }}
        >
          <AlertDialogContent
            overlayClassName="z-[80] bg-black/75 backdrop-blur-md"
            className="z-[81] max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-sm gap-4 overflow-y-auto rounded-2xl border border-[#393647] bg-[#171625] p-4 text-white shadow-2xl sm:p-5"
          >
            <AlertDialogHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-1 items-start gap-3 text-left">
              <span className="grid size-10 place-items-center rounded-xl border border-red-500/35 bg-red-500/10 text-red-500">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="m19 6-1 14H6L5 6" />
                  <path d="M10 11v5M14 11v5" />
                </svg>
              </span>
              <div className="grid min-w-0 gap-1 pt-0.5">
                <AlertDialogTitle className="text-base font-semibold tracking-tight text-white sm:text-lg">
                  ¿Estás seguro de eliminar?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm leading-relaxed text-white/65">
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cerrar confirmación"
                disabled={isDeleting}
                onClick={() => {
                  clearError();
                  setIsDeleteDialogOpen(false);
                }}
                className="size-8 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4">
                  <path d="m18 6-12 12M6 6l12 12" />
                </svg>
              </Button>
            </AlertDialogHeader>
            {hasMultipleVerses && (
              <p className="text-xs leading-relaxed text-white/50">
                Los versículos se eliminan desde el último hacia el primero.
              </p>
            )}
            {deleteError && (
              <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
                {deleteError}
              </p>
            )}
            <div
              className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3"
            >
              <AlertDialogCancel
                disabled={isDeleting}
                onClick={clearError}
                className="h-10 w-full rounded-lg border-white/15 bg-white/[0.04] text-sm text-white hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </AlertDialogCancel>
              {hasMultipleVerses && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleting || !canDeleteCurrentVerse}
                  onClick={() => void handleDelete("verse")}
                  title={canDeleteCurrentVerse ? undefined : "Elimina primero los versículos posteriores."}
                  className="h-auto min-h-10 w-full min-w-0 rounded-lg border-red-500/35 bg-red-500/5 px-2 text-xs font-semibold leading-tight whitespace-normal hover:bg-red-500/15 hover:text-white disabled:opacity-45"
                >
                  {isDeleting ? "Eliminando…" : "Eliminar versículo"}
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                onClick={() => void handleDelete("story")}
                className={`h-10 w-full min-w-0 gap-2 rounded-lg bg-[#c7191c] px-2 text-xs font-semibold leading-tight whitespace-normal text-white hover:bg-[#a90f12] sm:text-sm ${hasMultipleVerses ? "sm:col-span-2" : ""}`}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 sm:size-5">
                  <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m5 5v5m4-5v5" />
                </svg>
                <span className="min-w-0 break-words text-center">
                  {isDeleting ? "Eliminando…" : "Eliminar historia"}
                </span>
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </section>
  );
};

export { HistoriasCards as HistoriesCard };
