import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { ArrowDownToLine } from "@/icons/ArrowDownToLine";

import type { BibleVersePileItem } from "@/panel/components/biblie/bibleVersePile";
import {
  createBibleStory,
  type StoryVisibility,
} from "@/panel/actions/history/story.action";

interface PublishBibleStoryPileDialogProps {
  items: BibleVersePileItem[];
  onRemove: (normalizedReference: string) => void;
  onClear: () => void;
  onPublished: () => void;
}

interface CreateStoryErrorResponse {
  error?: {
    message?: string;
  };
}

const visibilityLabels: Record<StoryVisibility, string> = {
  public: "Pública (todos los creyentes)",
  followers: "Seguidores",
};

export const PublishBibleStoryPileDialog = ({
  items,
  onRemove,
  onClear,
  onPublished,
}: PublishBibleStoryPileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [visibility, setVisibility] = useState<StoryVisibility>("public");
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!items.length || isPublishing) return;

    setIsPublishing(true);
    try {
      await createBibleStory({
        visibility,
        verses: items.map(({ verse, caption }) => ({
          reference: verse.reference,
          ...(caption ? { caption } : {}),
        })),
      });

      toast.add({
        type: "success",
        description: `Se publicó la pila con ${items.length} versículo${items.length === 1 ? "" : "s"}.`,
        priority: "high",
        timeout: 4000,
      });
      setOpen(false);
      onPublished();
    } catch (error) {
      toast.add({
        type: "error",
        description:
          (axios.isAxiosError<CreateStoryErrorResponse>(error)
            ? error.response?.data.error?.message
            : undefined) ?? "No se pudo publicar la pila. Inténtalo de nuevo.",
        priority: "high",
        timeout: 5000,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!items.length) return null;

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 h-11 rounded-full bg-purple-700 px-5 text-sm font-semibold text-white shadow-lg hover:bg-purple-800"
      >
        <ArrowDownToLine className="mr-2 size-4" />
        Publicar pila de historias ({items.length})
      </Button>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!isPublishing) setOpen(nextOpen);
        }}
      >
        <DialogContent className="flex max-h-[90dvh] max-w-[calc(100%-1rem)] flex-col overflow-hidden rounded-xl p-0 sm:max-w-lg">
          <DialogHeader className="shrink-0 px-5 pb-4 pt-5">
            <DialogTitle>Publicar pila de historias</DialogTitle>
            <DialogDescription>
              Elige quién podrá ver estos versículos.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 pb-4">
            <div className="space-y-1.5">
              <Label htmlFor="story-pile-visibility">Visibilidad</Label>
              <Select
                value={visibility}
                onValueChange={(value) => {
                  if (value === "public" || value === "followers") {
                    setVisibility(value);
                  }
                }}
                disabled={isPublishing}
              >
                <SelectTrigger id="story-pile-visibility" className="h-11">
                  <SelectValue>
                    {(selectedValue: StoryVisibility | null) =>
                      selectedValue
                        ? visibilityLabels[selectedValue]
                        : "Selecciona una visibilidad"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    {visibilityLabels.public}
                  </SelectItem>
                  <SelectItem value="followers">
                    {visibilityLabels.followers}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmClearOpen(true)}
                disabled={isPublishing}
                className="text-xs text-red-700 hover:bg-red-50 hover:text-red-800"
              >
                Quitar todo
              </Button>
            </div>

            <ol className="space-y-2">
              {items.map(({ verse, caption }, index) => {
                const isAtPileEdge = index === 0 || index === items.length - 1;

                return (
                  <li
                    key={verse.normalized_reference}
                    className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-purple-800">
                        {index + 1}. {verse.reference}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs italic text-slate-700">
                        {verse.text}
                      </p>
                      {caption && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {caption}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(verse.normalized_reference)}
                      disabled={isPublishing || !isAtPileEdge}
                      aria-label={
                        isAtPileEdge
                          ? `Quitar ${verse.reference} de la pila`
                          : "Solo puedes quitar versículos de los extremos de la pila"
                      }
                      title={
                        isAtPileEdge
                          ? undefined
                          : "Solo puedes quitar versículos de los extremos"
                      }
                      className="shrink-0 text-slate-500 hover:text-red-700"
                    >
                      Quitar
                    </Button>
                  </li>
                );
              })}
            </ol>
          </div>

          <DialogFooter className="shrink-0 border-t bg-slate-100 px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPublishing}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || items.length === 0}
              className="bg-purple-700 text-white hover:bg-purple-800"
            >
              {isPublishing ? "Publicando…" : "Publicar historias"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar toda la pila?</AlertDialogTitle>
            <AlertDialogDescription>
              Se quitarán los {items.length} versículos de la pila. ¿Estás
              seguro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClear}
              className="bg-red-700 text-white hover:bg-red-800"
            >
              Quitar todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
