import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
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

import type { BibleVersePileItem } from "@/panel/components/biblie/bibleVersePile";
import {
  createBibleStory,
  type StoryVisibility,
} from "@/panel/actions/history/story.action";

interface PublishBibleStoryPileDialogProps {
  items: BibleVersePileItem[];
  onRemove: (normalizedReference: string) => void;
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
  onPublished,
}: PublishBibleStoryPileDialogProps) => {
  const [open, setOpen] = useState(false);
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mr-2"
        >
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
        Publicar pila de historias ({items.length})
      </Button>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!isPublishing) setOpen(nextOpen);
        }}
      >
        <DialogContent className="max-h-[90dvh] max-w-[calc(100%-1rem)] overflow-hidden rounded-xl p-0 sm:max-w-lg">
          <DialogHeader className="px-5 pb-4 pt-5">
            <DialogTitle>Publicar pila de historias</DialogTitle>
            <DialogDescription>
              Elige quién podrá ver estos versículos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto px-5 pb-4">
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

            <ol className="space-y-2">
              {items.map(({ verse, caption }, index) => (
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
                    disabled={isPublishing}
                    aria-label={`Quitar ${verse.reference} de la pila`}
                    className="shrink-0 text-slate-500 hover:text-red-700"
                  >
                    Quitar
                  </Button>
                </li>
              ))}
            </ol>
          </div>

          <DialogFooter className="border-t bg-slate-100 px-5 py-4">
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
    </>
  );
};
