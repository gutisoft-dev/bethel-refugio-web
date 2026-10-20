import { useCallback, useMemo, type Dispatch, type SetStateAction } from "react";
import { toast } from "@/components/ui/toast";
import { useDeleteStory } from "@/panel/hooks/useDeleteStory";
import type { Historia } from "@/panel/interfaces/History.interface";

interface UseHistoryDeletionOptions {
  current?: Historia;
  stories: Historia[];
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  onRemoveStoryContent: (storyId: string, position?: number) => void;
  onStoryContentDeleted?: (storyId: string, position?: number) => void;
}

export const useHistoryDeletion = ({
  current,
  stories,
  isDialogOpen,
  setIsDialogOpen,
  onRemoveStoryContent,
  onStoryContentDeleted,
}: UseHistoryDeletionOptions) => {
  const {
    isDeleting,
    error,
    clearError,
    removeStory,
    removeVerse,
  } = useDeleteStory();

  const currentStorySlides = useMemo(
    () => stories.filter((story) => story.storyId === current?.storyId),
    [current?.storyId, stories],
  );
  const hasMultipleVerses = currentStorySlides.length > 1;
  const lastVersePosition = currentStorySlides.reduce(
    (lastPosition, story) => Math.max(lastPosition, story.position),
    0,
  );
  const canDeleteCurrentVerse =
    hasMultipleVerses && current?.position === lastVersePosition;

  const handleDelete = useCallback(
    async (target: "verse" | "story") => {
      if (!current || isDeleting) return;
      if (target === "verse" && !canDeleteCurrentVerse) return;

      const deleted =
        target === "verse"
          ? await removeVerse(current.storyId, current.position)
          : await removeStory(current.storyId);

      if (!deleted) return;

      if (target === "verse") {
        onRemoveStoryContent(current.storyId, current.position);
        onStoryContentDeleted?.(current.storyId, current.position);
        toast.add({
          type: "success",
          description: `Se eliminó el versículo ${current.reference}.`,
          priority: "high",
          timeout: 3500,
        });
      } else {
        onRemoveStoryContent(current.storyId);
        onStoryContentDeleted?.(current.storyId);
        toast.add({
          type: "success",
          description: "Se eliminó la historia completa.",
          priority: "high",
          timeout: 3500,
        });
      }

      setIsDialogOpen(false);
    },
    [
      canDeleteCurrentVerse,
      current,
      isDeleting,
      onRemoveStoryContent,
      onStoryContentDeleted,
      removeStory,
      removeVerse,
      setIsDialogOpen,
    ],
  );

  return {
    isDialogOpen,
    setIsDialogOpen,
    isDeleting,
    error,
    clearError,
    hasMultipleVerses,
    canDeleteCurrentVerse,
    handleDelete,
  };
};
