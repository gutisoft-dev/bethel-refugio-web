import { useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BibleVerse } from "@/panel/actions/biblie/search.action";
import { favoriteBibleVerse } from "@/panel/actions/biblie/favorite.action";
import { toast } from "@/components/ui/toast";
import {
  AddBibleVerseToStoryDialog,
  type StoryVisibilityOption,
} from "@/panel/components/biblie/AddBibleVerseToStoryDialog";

interface SaveFavoriteButtonProps {
  verse: BibleVerse;
}

interface FavoriteErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
}

const SaveFavoriteButton = ({ verse }: SaveFavoriteButtonProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (isSaving || isSaved) return;

    setIsSaving(true);
    try {
      await favoriteBibleVerse(verse.normalized_reference);
      setIsSaved(true);
      toast.add({
        type: "success",
        description: `${verse.reference} se guardó en tus favoritos.`,
        priority: "high",
      });
    } catch (error) {
      if (
        axios.isAxiosError<FavoriteErrorResponse>(error) &&
        error.response?.data.error?.code === "FAVORITE_VERSE_ALREADY_EXISTS"
      ) {
        setIsSaved(true);
        toast.add({
          type: "error",
          description:
            error.response.data.error.message ??
            "El versículo ya está marcado como favorito.",
          priority: "high",
        });
        return;
      }

      toast.add({
        type: "error",
        description: `No se pudo guardar ${verse.reference}. Inténtalo de nuevo.`,
        priority: "high",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleSave}
      disabled={isSaving || isSaved}
      aria-live="polite"
      className="h-7 rounded-md border-purple-300 px-3 text-[10px] text-purple-700 hover:bg-purple-50"
    >
      {isSaving ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mr-1.5 animate-spin"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Guardando...
        </>
      ) : isSaved ? (
        "Guardado"
      ) : (
        "Guardar"
      )}
    </Button>
  );
};

interface BibleResultsProps {
  results: BibleVerse[];
  totalResults: number;
  loadedResults: number;
  isLoadingMore?: boolean;
  hasNext?: boolean;
  loadMoreError?: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onProject: (verse: BibleVerse) => void;
  onRetryLoadMore: () => void;
  storyVisibilityOptions: StoryVisibilityOption[];
}

export const BibleResults = ({
  results,
  totalResults,
  loadedResults,
  isLoadingMore = false,
  hasNext = false,
  loadMoreError = false,
  sentinelRef,
  onProject,
  onRetryLoadMore,
  storyVisibilityOptions,
}: BibleResultsProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <section className="mt-6 w-full">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Resultados de búsqueda
            </h2>

            <Badge variant="secondary" className="rounded-full text-[10px]">
              {totalResults} versículos encontrados
            </Badge>
          </div>

          <span className="text-[10px] text-slate-500" aria-live="polite">
            Mostrando {loadedResults} de {totalResults}
          </span>
        </div>

        <div className="space-y-3">
          {results.map((result) => (
            <Card
              key={result.normalized_reference}
              className="
                overflow-hidden
                border-slate-200
                border-l-[3px]
                border-l-purple-600
                shadow-sm
              "
            >
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {result.reference}
                    </h3>

                    <Badge
                      variant="secondary"
                      className="
                        rounded
                        bg-slate-100
                        px-1.5
                        py-0.5
                        text-[8px]
                        font-medium
                        text-slate-500
                        hover:bg-slate-100
                      "
                    >
                      {result.normalized_reference}
                    </Badge>
                  </div>

                  <div
                    className="flex flex-wrap items-center gap-2"
                    role="group"
                    aria-label={`Acciones para ${result.reference}`}
                  >
                    <Badge
                      className="
                        rounded-full
                        bg-purple-100
                        px-2.5
                        py-0.5
                        text-[9px]
                        font-medium
                        text-purple-700
                        hover:bg-purple-100
                      "
                    >
                      {result.book.name}
                    </Badge>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onProject(result)}
                            className="
                            h-7
                            rounded-md
                            border-purple-300
                            px-3
                            text-[10px]
                            text-purple-700
                            hover:bg-purple-50
                          "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              className="mr-1.5"
                            >
                              <rect x="3" y="4" width="18" height="14" rx="2" />
                              <path d="M8 20h8" />
                              <path d="M12 18v2" />
                            </svg>
                            Proyectar
                          </Button>
                        }
                      />

                      <TooltipContent>Proyectar versículo</TooltipContent>
                    </Tooltip>

                    <SaveFavoriteButton verse={result} />

                    <AddBibleVerseToStoryDialog
                      verse={result}
                      visibilityOptions={storyVisibilityOptions}
                    />
                  </div>
                </div>

                <div className="mt-4 border-l border-purple-300 pl-3">
                  <p className="text-xs italic leading-6 text-slate-700">
                    "{result.text}"
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-3 rounded-md bg-slate-100 px-2 py-2.5">
                  <div>
                    <p className="text-[8px] font-medium uppercase tracking-wide text-slate-500">
                      Libro
                    </p>

                    <p className="mt-0.5 text-[11px] font-semibold text-slate-700">
                      {result.book.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] font-medium uppercase tracking-wide text-slate-500">
                      Capítulo
                    </p>

                    <p className="mt-0.5 text-[11px] font-semibold text-slate-700">
                      {result.chapter}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] font-medium uppercase tracking-wide text-slate-500">
                      Versículo
                    </p>

                    <p className="mt-0.5 text-[11px] font-semibold text-slate-700">
                      {result.verse}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          ref={sentinelRef}
          className="flex min-h-12 items-center justify-center py-4"
          aria-live="polite"
          aria-busy={isLoadingMore}
        >
          {isLoadingMore && (
            <Badge variant="secondary">Cargando más resultados...</Badge>
          )}

          {loadMoreError && !isLoadingMore && (
            <div className="flex items-center gap-3" role="alert">
              <span className="text-xs text-red-700">
                No se pudieron cargar más resultados.
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRetryLoadMore}
              >
                Reintentar
              </Button>
            </div>
          )}

          {!isLoadingMore && !hasNext && (
            <Badge variant="outline" className="text-slate-400">
              Has llegado al final de los resultados.
            </Badge>
          )}
        </div>
      </section>
    </TooltipProvider>
  );
};
