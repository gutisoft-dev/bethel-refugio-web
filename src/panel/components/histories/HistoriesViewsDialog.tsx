import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getStoryVerseViews,
  type StoryVerseView,
} from "@/panel/actions/history/story.action";

interface HistoriesViewsDialogProps {
  storyId: string;
  position: number;
  reference: string;
  count: number;
}

const getViewerName = (view: StoryVerseView) => {
  const viewer = view.viewer ?? view.user;
  const fullName = [viewer?.first_name, viewer?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || viewer?.username || view.username || "Usuario";
};

const getViewerAvatar = (view: StoryVerseView) => {
  const viewer = view.viewer ?? view.user;
  return viewer?.avatar || viewer?.profile_picture || undefined;
};

const getViewerInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("es") || "U";

const formatViewedAt = (date?: string) => {
  if (!date) return null;
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
};

export const HistoriesViewsDialog = ({
  storyId,
  position,
  reference,
  count,
}: HistoriesViewsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [views, setViews] = useState<StoryVerseView[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let isCurrent = true;
    setIsLoading(true);
    setError(null);
    setViews([]);
    setNextCursor(null);

    void getStoryVerseViews(storyId, position)
      .then((response) => {
        if (!isCurrent) return;
        if (!Array.isArray(response.results)) {
          throw new Error("El servicio devolvió una respuesta inesperada.");
        }
        setViews(response.results);
        setNextCursor(response.next);
      })
      .catch((requestError: unknown) => {
        if (!isCurrent) return;
        const apiMessage = axios.isAxiosError<{ detail?: string; message?: string }>(requestError)
          ? requestError.response?.data?.detail ?? requestError.response?.data?.message
          : undefined;
        setError(
          apiMessage ??
            (requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar las visualizaciones."),
        );
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [open, storyId, position]);

  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);
    try {
      const response = await getStoryVerseViews(storyId, position, nextCursor);
      setViews((currentViews) => [...currentViews, ...response.results]);
      setNextCursor(response.next);
    } catch {
      setError("No se pudieron cargar más visualizaciones.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={() => setOpen(true)}
        className="h-auto gap-1 p-0 text-white/70 hover:bg-transparent hover:text-white"
        aria-label={`Ver ${count} visualizaciones de ${reference}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3"
        >
          <path d="M2.06 12.35a1 1 0 0 1 0-.7 10 10 0 0 1 19.88 0 1 1 0 0 1 0 .7 10 10 0 0 1-19.88 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {count} vistas
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(80dvh,36rem)] max-w-[calc(100%-1.5rem)] overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="border-b border-slate-200 px-5 py-4 pr-12">
            <DialogTitle>Visualizaciones</DialogTitle>
            <DialogDescription>
              Personas que vieron {reference}, posición {position}.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[55dvh] overflow-y-auto px-5 py-3">
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground" role="status">
                Cargando visualizaciones…
              </p>
            ) : error && views.length === 0 ? (
              <div className="space-y-3 py-6 text-center">
                <p className="text-sm text-destructive" role="alert">{error}</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Cerrar
                </Button>
              </div>
            ) : views.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aún no hay visualizaciones registradas.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {views.map((view, index) => {
                  const name = getViewerName(view);
                  const avatar = getViewerAvatar(view);
                  const viewedAt = formatViewedAt(view.viewed_at ?? view.created_at);

                  return (
                    <li
                      key={view.id ?? `${name}-${view.viewed_at ?? view.created_at ?? index}`}
                      className="flex items-center gap-3 py-3"
                    >
                      {avatar ? (
                        <img src={avatar} alt="" className="size-9 rounded-full object-cover" />
                      ) : (
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-800">
                          {getViewerInitials(name)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{name}</p>
                        {viewedAt && (
                          <p className="text-xs text-muted-foreground">{viewedAt}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {error && views.length > 0 && (
              <p className="py-2 text-center text-xs text-destructive" role="alert">{error}</p>
            )}
            {nextCursor && !isLoading && (
              <div className="flex justify-center py-3">
                <Button type="button" variant="outline" size="sm" onClick={() => void loadMore()} disabled={isLoadingMore}>
                  {isLoadingMore ? "Cargando…" : "Cargar más"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
