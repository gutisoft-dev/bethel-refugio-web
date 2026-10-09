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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

import type { BibleVerse } from "@/panel/actions/biblie/search.action";
import type { BibleVersePileItem } from "@/panel/components/biblie/bibleVersePile";
import { createBibleStory, type StoryVisibility } from "@/panel/actions/history/story.action";

export interface StoryVisibilityOption {
  value: StoryVisibility;
  label: string;
}

interface AddBibleVerseToStoryDialogProps {
  verse: BibleVerse;
  visibilityOptions: StoryVisibilityOption[];
  mode?: "story" | "pile";
  isVerseInPile?: boolean;
  onAddToPile?: (item: BibleVersePileItem) => void;
}

interface CreateStoryErrorResponse {
  error?: {
    message?: string;
  };
}

export const AddBibleVerseToStoryDialog = ({
  verse,
  visibilityOptions,
  mode = "story",
  isVerseInPile = false,
  onAddToPile,
}: AddBibleVerseToStoryDialogProps) => {
  const [open, setOpen] = useState(false);

  const [visibility, setVisibility] = useState(
    visibilityOptions[0]?.value ?? "",
  );

  const [caption, setCaption] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateStory = async () => {
    if (mode === "pile") {
      onAddToPile?.({ verse, caption: caption.trim() });
      toast.add({
        type: "success",
        description: `${verse.reference} se agregó a la pila.`,
        priority: "high",
        timeout: 3000,
      });
      setOpen(false);
      setCaption("");
      return;
    }

    if (!visibility || isCreating) return;

    setIsCreating(true);

    try {
      await createBibleStory({
        visibility,
        verses: [
          {
            reference: verse.reference,
            ...(caption.trim()
              ? {
                  caption: caption.trim(),
                }
              : {}),
          },
        ],
      });

      toast.add({
        type: "success",
        description: `Se creó una historia con ${verse.reference}.`,
        priority: "high",
        timeout: 4000,
      });

      setOpen(false);
      setCaption("");
    } catch (error) {
      toast.add({
        type: "error",
        description:
          (axios.isAxiosError<CreateStoryErrorResponse>(error)
            ? error.response?.data.error?.message
            : undefined) ??
          `No se pudo crear la historia con ${verse.reference}. Inténtalo de nuevo.`,
        priority: "high",
        timeout: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (isCreating) return;

    setOpen(value);

    if (!value) {
      setCaption("");
    }
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-7 rounded-md bg-purple-700 px-3 text-[10px] text-white hover:bg-purple-800"
      >
        {mode === "pile"
          ? isVerseInPile
            ? "En la pila"
            : "Agregar a pila"
          : "Añadir a historia"}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="
            max-w-[calc(100%-1rem)]
            sm:max-w-106
            overflow-hidden
            rounded-xl
            border
            p-0
            shadow-2xl
          "
        >

          <DialogHeader className="px-5 pb-4 pt-5">
            <div className="flex items-center gap-2.5">
              {/* Icono */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-purple-100
                  text-purple-700
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063L2 12l6.5-2.063A2 2 0 0 0 9.937 8.5L12 2l2.063 6.5A2 2 0 0 0 15.5 9.937L22 12l-6.5 2.063a2 2 0 0 0-1.437 1.437L12 22Z" />
                  <path d="M20 3v4" />
                  <path d="M22 5h-4" />
                  <path d="M4 17v2" />
                  <path d="M5 18H3" />
                </svg>
              </div>

              <div className="min-w-0 pt-0.5">
                <DialogTitle className="text-base font-semibold leading-tight">
                  {mode === "pile" ? "Agregar a pila" : "Añadir a Historia"}
                </DialogTitle>

                <DialogDescription className="mt-0.5 flex items-center gap-1 text-[10px]">
                  <span className="font-semibold text-purple-700">
                    {verse.reference}
                  </span>

                  {/* <span className="text-muted-foreground">•</span>

                  <span className="text-muted-foreground">RVR1960</span> */}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Separator />


          <div className="space-y-4 px-5 py-4">
            <div
              className="
                rounded-xl
                border
                border-purple-200
                border-l-[3px]
                border-l-purple-700
                bg-[#f8f5fb]
                px-3
                py-3
                shadow-sm
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    text-[13px]
                    italic
                    leading-[1.55]
                    text-foreground
                  "
                >
                  "{verse.text}"
                </p>

                <Separator className="my-2" />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold text-foreground">
                    {verse.reference}
                  </span>

                  <span
                    className="
                      rounded-md
                      bg-muted
                      px-1.5
                      py-0.5
                      font-mono
                      text-[9px]
                      font-medium
                      text-muted-foreground
                    "
                  >
                    {verse.normalized_reference}
                  </span>
                </div>
              </div>
            </div>

            {mode === "story" && (
              <div className="space-y-1.5">
                <Label
                  htmlFor={`story-visibility-${verse.normalized_reference}`}
                  className="text-xs font-semibold"
                >
                  Visibilidad / Tipo de historia
                </Label>

                <Select
                  value={visibility}
                  onValueChange={(value) => {
                    if (value === "public" || value === "followers") {
                      setVisibility(value);
                    }
                  }}
                  disabled={isCreating}
                >
                  <SelectTrigger
                    id={`story-visibility-${verse.normalized_reference}`}
                    className="h-12 rounded-xl bg-background px-4 text-sm"
                  >
                    <SelectValue>
                      {(selectedValue: StoryVisibility | null) =>
                        visibilityOptions.find(
                          (option) => option.value === selectedValue,
                        )?.label ?? "Selecciona una visibilidad"
                      }
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {visibilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={`story-caption-${verse.normalized_reference}`}
                  className="text-xs font-semibold"
                >
                  Reflexión o mensaje personal{" "}
                  <span className="font-normal text-muted-foreground">
                    (opcional)
                  </span>
                </Label>

                <span
                  className={`text-xs ${
                    caption.length >= 280
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {caption.length}/280
                </span>
              </div>

              <Textarea
                id={`story-caption-${verse.normalized_reference}`}
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                disabled={isCreating}
                maxLength={280}
                rows={4}
                placeholder="Escribe una reflexión, pensamiento o nota devocional para acompañar este versículo..."
                className="
                  min-h-20
                  resize-none
                  rounded-lg
                  px-3
                  py-2.5
                  text-xs
                  leading-[1.45]
                  placeholder:text-muted-foreground/60
                "
              />
            </div>
          </div>

          <DialogFooter
            className="
              flex
              flex-row
              justify-end
              gap-2
              border-t
              bg-slate-100
              px-5
              py-4
            "
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
              className="h-9 rounded-lg px-4 text-xs"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleCreateStory}
              disabled={isCreating || !visibility}
              className="
                h-9
                rounded-lg
                bg-purple-700
                px-4
                text-xs
                text-white
                shadow-md
                hover:bg-purple-800
              "
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
                className="mr-2 h-4 w-4"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>

              {mode === "pile"
                ? "Agregar a pila"
                : isCreating
                  ? "Creando…"
                  : "Crear historia"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
