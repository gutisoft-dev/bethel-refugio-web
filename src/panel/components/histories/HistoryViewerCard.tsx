import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type TouchEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Book } from "@/icons/Book";
import type { Historia } from "@/panel/interfaces/History.interface";
import type { HistoryFeed } from "./HistoriesHeader";
import { getVerseFontSize } from "@/panel/helpers/getAll";
import { HistoriesViewsDialog } from "./HistoriesViewsDialog";
import { SaveVerse } from "./SaveVerse";
import { Clock } from "@/icons/Clock";
import { Delete } from "@/icons/Delete";
import { Download } from "@/icons/Download";
import { LoaderCircle } from "@/icons/LoaderCircle";
import { Pause } from "@/icons/Pause";
import { Play } from "@/icons/Play";

interface HistoryViewerCardProps {
  story: Historia;
  feed: HistoryFeed;
  isAuthenticated: boolean;
  isDeleting: boolean;
  isDownloading: boolean;
  isTimerPaused: boolean;
  isManuallyPaused: boolean;
  onTogglePause: () => void;
  onTouchPauseChange: (isPaused: boolean) => void;
  onDeleteClick: () => void;
  onNavigateToProfile: (username: string) => void;
  onViewsDialogOpenChange: (open: boolean) => void;
  onDownload: () => void;
  onVerseFavorited: (storyId: string, normalizedReference: string) => void;
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
  isManuallyPaused,
  onTogglePause,
  onTouchPauseChange,
  onDeleteClick,
  onNavigateToProfile,
  onViewsDialogOpenChange,
  onDownload,
  onVerseFavorited,
}: HistoryViewerCardProps) => {
  const isPausingTouchRef = useRef(false);

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const target = event.target;
    if (
      target instanceof Element &&
      target.closest("button, a, input, textarea, select")
    ) {
      isPausingTouchRef.current = false;
      return;
    }

    const touch = event.touches[0];
    isPausingTouchRef.current = Boolean(touch);
    if (touch) onTouchPauseChange(true);
  };

  const handleTouchEnd = () => {
    if (isPausingTouchRef.current) onTouchPauseChange(false);
    isPausingTouchRef.current = false;
  };

  return (
  <article
    aria-label={`Historia de ${story.author}: ${story.reference}`}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
    onTouchCancel={() => {
      if (isPausingTouchRef.current) onTouchPauseChange(false);
      isPausingTouchRef.current = false;
    }}
    className="histories-grid-card relative flex h-dvh max-h-dvh min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-none border-0 bg-slate-950 p-0 text-primary-foreground shadow-2xl sm:h-[min(800px,100%)] sm:max-h-200 sm:w-[min(448px,calc(100vw-32px))] sm:rounded-[2rem] sm:border sm:border-primary/40"
  >
    <span
      className="histories-grid-card-overlay pointer-events-none absolute inset-0 opacity-90"
      aria-hidden="true"
    />
    <div
      className="absolute left-5 right-16 top-5 z-10 flex gap-1.5 sm:inset-x-5"
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
              style={{
                animationPlayState: isTimerPaused ? "paused" : "running",
              }}
            />
          ) : null}
        </span>
      ))}
    </div>

    <header className="relative z-10 flex items-center justify-between gap-2 px-6 pt-18 sm:px-8 sm:pt-14">
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
            <Clock className="size-3.5 shrink-0" />
            <span className="truncate">
              @{story.username} · {story.elapsed}
            </span>
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={isTimerPaused ? "Reanudar historia" : "Pausar historia"}
          aria-pressed={isManuallyPaused}
          title={isTimerPaused ? "Reanudar historia" : "Pausar historia"}
          onClick={onTogglePause}
          className="size-9 rounded-full bg-white/20 p-0 text-white backdrop-blur-md hover:bg-white/30 hover:text-white focus-visible:ring-white [&_svg]:size-4"
        >
          {isTimerPaused ? <Play /> : <Pause />}
        </Button>
        {feed === "mine" && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Eliminar la historia de ${story.reference}`}
          title="Eliminar historia o versículo"
          disabled={isDeleting || story.status?.toLowerCase() === "expired"}
          onClick={onDeleteClick}
          className="size-9 shrink-0 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 hover:text-white active:scale-90 focus-visible:ring-white"
        >
          <Delete className="size-5 " />
        </Button>
        )}
      </div>
    </header>

    <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-start overflow-y-auto overscroll-contain px-5 pb-6 pt-5 text-left [scrollbar-color:rgba(255,255,255,0.3)_transparent] scrollbar-thin sm:justify-end sm:px-8 sm:pb-12 sm:pt-6">
      <span className="mb-4 inline-flex max-w-full items-center gap-2 self-start rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm sm:mb-5">
        <Book />
        {story.reference}
        <span>♡ {story.favorites} favoritos</span>
      </span>
      <blockquote
        className="history-verse-text my-auto select-none text-center font-semibold leading-tight tracking-tight text-white transition-[font-size] duration-200 sm:leading-[1.12]"
        style={
          {
            "--history-verse-font-size": `${getVerseFontSize(story.verse)}px`,
          } as CSSProperties
        }
      >
        {story.verse}
      </blockquote>
      <span className="block w-full min-w-0 max-w-md px-2 text-center text-[10px] leading-relaxed text-white/60 sm:text-xs">
        Texto bíblico Reina-Valera 1960® © Sociedades Bíblicas en América
        Latina, 1960. Derechos renovados 1988, Sociedades Bíblicas Unidas.
      </span>
      {story.description && (
        <HistoryCaption id={story.id} text={story.description} />
      )}

      <div className="mt-5 flex w-full items-center justify-between gap-2 border-t border-white/20 pt-4 text-sm text-white/80 sm:gap-4">
        <SaveVerse
          story={story}
          onSaved={() =>
            onVerseFavorited(story.storyId, story.normalized_reference)
          }
        />
        {feed === "mine" && (
          <HistoriesViewsDialog
            storyId={story.storyId}
            position={story.position}
            reference={story.reference}
            count={story.views}
            onOpenChange={onViewsDialogOpenChange}
          />
        )}
        {isAuthenticated && (
          <Button
            type="button"
            variant="ghost"
            aria-label={`Descargar imagen de ${story.reference}`}
            title="Descargar imagen para compartir"
            disabled={isDownloading}
            aria-busy={isDownloading}
            onClick={onDownload}
            className="h-10 flex-1 justify-center gap-2 rounded-lg px-2 text-sm text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-white sm:text-base"
          >
            {isDownloading ? (
              <LoaderCircle className="size-6 animate-spin" />
            ) : (
              <Download className="size-6" />
            )}
          </Button>
        )}
      </div>
    </div>
  </article>
  );
};
