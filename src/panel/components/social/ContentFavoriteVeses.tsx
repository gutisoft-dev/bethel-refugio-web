import { Badge } from "@/components/ui/badge";
import { useFavoriteVerses } from "@/panel/hooks/useFavoriteVerses";
import { ContentVerses } from "./ContentVerses";
import { ContentEmpty } from "./ContentEmpty";
import { VerseProjection } from "./VerseProjection";
import { useEffect, useMemo, useRef, useState } from "react";
import { ModaleDelete } from "./ModaleDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavoriteVerse } from "@/panel/actions/social/FavoriteVerses";
import { toast } from "@/components/ui/toast";
import axios from "axios";

interface Props {
  id: string;
}

export const ContentFavoriteVeses = ({ id }: Props) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFavoriteVerses(id);
  const queryClient = useQueryClient();

  const verses = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  );

  useEffect(() => {
    const element = observerRef.current;

    if (!element || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [SelectedReferences, setSelectedReferences] = useState<string | null>(
    null,
  );

  const [selectedVerse, setselectedVerse] = useState<number>(0);

  const onClose = () => {
    setOpen(false);
  };

  const onSelected = (index: number) => {
    setOpen(true);
    setselectedVerse(index);
  };

  const onOpenDeleted = (references: string) => {
    setOpenDelete(true);
    setSelectedReferences(references);
  };

  const onCloseDeleted = () => {
    setOpenDelete(false);
  };

  const deleteFavoriteVerseMutation = useMutation({
    mutationFn: deleteFavoriteVerse,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorite-verses"],
      });
      toast.add({
        type: "success",
        description: `Verso eliminado con exito`,
        priority: "high",
      });
      setOpenDelete(false);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.add({
          type: "error",
          description: `Ha ocurrido un error `,
          priority: "high",
        });
        return;
      }
    },
  });

  const selectedVerseView = verses[selectedVerse];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Resultados</h2>

          <Badge variant="secondary" className="rounded-full text-[10px]">
            {verses.length} versículos
          </Badge>
        </div>
      </div>
      <div className="grid gap-5">
        {verses.map((result, index) => (
          <ContentVerses
            key={result.normalized_reference}
            result={result}
            onOpen={onSelected}
            index={index}
            onOpenDeleted={onOpenDeleted}
          />
        ))}
        {verses.length === 0 && (
          <ContentEmpty text="No tienes versículos favoritos" />
        )}
      </div>

      {hasNextPage && (
        <div
          ref={observerRef}
          className="py-6 text-center text-sm text-slate-500"
        >
          {isFetchingNextPage && "Cargando más versículos..."}
        </div>
      )}

      {!hasNextPage && verses.length > 0 && (
        <p className="py-6 text-center text-sm text-slate-500">
          No hay más versículos.
        </p>
      )}

      {selectedVerseView && (
        <VerseProjection
          open={open}
          onClose={onClose}
          verse={selectedVerseView}
          verses={verses || []}
        />
      )}

      <ModaleDelete
        handleDelete={() => {
          if (SelectedReferences) {
            deleteFavoriteVerseMutation.mutate(SelectedReferences);
          }
        }}
        open={openDelete}
        onCloseDeleted={onCloseDeleted}
        text="¿Deseas eliminar el verso?"
      />
    </div>
  );
};
