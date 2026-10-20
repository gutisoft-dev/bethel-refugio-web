import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Book } from "@/icons/Book";
import type { Historia } from "@/panel/interfaces/History.interface";
import type { HistoryFeed } from "./HistoriesHeader";
import { getVerseFontSize } from "@/panel/helpers/getAll";
import { HistoriesViewsDialog } from "./HistoriesViewsDialog";
import { SaveVerse } from "./SaveVerse";

interface HistoryViewerCardProps {
  story: Historia;
  feed: HistoryFeed;
  isAuthenticated: boolean;
  isDeleting: boolean;
  isDownloading: boolean;
  isTimerPaused: boolean;
  onDeleteClick: () => void;
  onNavigateToProfile: (username: string) => void;
  onViewsDialogOpenChange: (open: boolean) => void;
  onDownload: () => void;
}

interface HistoryCaptionProps {
  id: string;
  text: string;
}

const HistoryCaption = ({ id, text }: HistoryCaptionProps) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
    setHasOverflow(false);
  }, [id, text]);

  useEffect(() => {
    const description = descriptionRef.current;
    if (!description || isExpanded) return;

    const measureOverflow = () => {
      setHasOverflow(description.scrollHeight > description.clientHeight + 1);
    };

    measureOverflow();
    const observer = new ResizeObserver(measureOverflow);
    observer.observe(description);
    return () => observer.disconnect();
  }, [id, isExpanded, text]);

  return (
    <div className="mt-4">
      <p
        ref={descriptionRef}
        id={`history-description-${id}`}
        className={`text-sm leading-6 text-white/90 ${isExpanded ? "max-h-none" : "max-h-12 overflow-hidden"}`}
      >
        {text}
      </p>
      {(hasOverflow || isExpanded) && (
        <button
          type="button"
          aria-controls={`history-description-${id}`}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="mt-0.5 text-xs font-semibold text-white/70 hover:text-white focus-visible:outline-none focus-visible:underline"
        >
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
};

export const HistoryViewerCard = ({
  story,
  feed,
  isAuthenticated,
  isDeleting,
  isDownloading,
  isTimerPaused,
  onDeleteClick,
  onNavigateToProfile,
  onViewsDialogOpenChange,
  onDownload,
}: HistoryViewerCardProps) => (
  <article
    aria-label={`Historia de ${story.author}: ${story.reference}`}
    className="histories-grid-card relative flex h-[min(680px,calc(100dvh-8rem))] max-h-[min(680px,calc(100dvh-8rem))] min-h-0 w-[min(448px,calc(100vw-32px))] shrink-0 flex-col overflow-hidden rounded-[2rem] border border-primary/40 bg-slate-950 p-0 text-primary-foreground shadow-2xl sm:h-[min(800px,100%)] sm:max-h-200"
  >
    <span
      className="histories-grid-card-overlay pointer-events-none absolute inset-0 opacity-90"
      aria-hidden="true"
    />
    <div
      className="absolute inset-x-5 top-5 z-10 flex gap-1.5"
      aria-label="Progreso de la historia"
    >
      {Array.from({ length: story.totalVerses }).map((_, index) => (
        <span
          key={`${story.id}-${index}`}
          className="h-0.75 flex-1 overflow-hidden rounded-full bg-white/25"
        >
          {index < story.position - 1 ? (
            <span className="block h-full w-full rounded-full bg-white" />
          ) : index === story.position - 1 ? (
            <span
              className="block h-full origin-left rounded-full bg-white animate-[story-progress_10s_linear_forwards]"
              style={{ animationPlayState: isTimerPaused ? "paused" : "running" }}
            />
          ) : null}
        </span>
      ))}
    </div>

    <header className="relative z-10 flex items-center justify-between gap-2 px-6 pt-12 sm:px-8 sm:pt-14">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold ring-1 ring-white/60 backdrop-blur-sm"
          onClick={() => onNavigateToProfile(story.author)}
          aria-label={`Ver perfil de ${story.author}`}
        >
          {story.initials}
        </button>
        <div className="min-w-0">
          <button
            type="button"
            className="block max-w-full truncate text-left text-sm font-semibold hover:underline"
            onClick={() => onNavigateToProfile(story.author)}
          >
            {story.author}
          </button>
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
              @{story.username} · {story.elapsed}
            </span>
          </p>
        </div>
      </div>
      {feed === "mine" && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Eliminar la historia de ${story.reference}`}
          title="Eliminar historia o versículo"
          disabled={isDeleting || story.status?.toLowerCase() === "expired"}
          onClick={onDeleteClick}
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

    <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-start overflow-y-auto overscroll-contain px-5 pb-6 pt-5 text-left [scrollbar-color:rgba(255,255,255,0.3)_transparent] scrollbar-thin sm:justify-end sm:px-8 sm:pb-12 sm:pt-6">
      <span className="mb-4 inline-flex max-w-full items-center gap-2 self-start rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm sm:mb-5">
        <Book />
        {story.reference}
        <SaveVerse normalized_reference={story.normalized_reference} />
      </span>
      <blockquote
        className="history-verse-text my-auto text-center font-semibold leading-tight tracking-tight text-white transition-[font-size] duration-200 sm:leading-[1.12]"
        style={
          {
            "--history-verse-font-size": `${getVerseFontSize(story.verse)}px`,
          } as CSSProperties
        }
      >
        {story.verse}
      </blockquote>
      {story.description && (
        <HistoryCaption id={story.id} text={story.description} />
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/75">
        {feed === "mine" && (
          <>
            <span>♡ {story.favorites} favoritos</span>
            <span>♥ {story.reactions} reacciones</span>
            <HistoriesViewsDialog
              storyId={story.storyId}
              position={story.position}
              reference={story.reference}
              count={story.views}
              onOpenChange={onViewsDialogOpenChange}
            />
          </>
        )}
        {isAuthenticated && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Descargar imagen de ${story.reference}`}
            title="Descargar imagen para compartir"
            disabled={isDownloading}
            aria-busy={isDownloading}
            onClick={onDownload}
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
);
