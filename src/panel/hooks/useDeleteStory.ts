import { useCallback, useRef, useState } from "react";
import axios from "axios";
import {
  deleteStory,
  deleteStoryVerse,
} from "../actions/history/story.action";

interface DeleteStoryApiError {
  detail?: string;
  message?: string;
  error?: { message?: string };
}

const getDeleteErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<DeleteStoryApiError>(error)) {
    return (
      error.response?.data?.error?.message ??
      error.response?.data?.detail ??
      error.response?.data?.message ??
      "No se pudo eliminar el contenido. Inténtalo de nuevo."
    );
  }

  return error instanceof Error
    ? error.message
    : "No se pudo eliminar el contenido. Inténtalo de nuevo.";
};

export const useDeleteStory = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInFlight = useRef(false);

  const runDelete = useCallback(
    async (request: () => Promise<void>): Promise<boolean> => {
      if (requestInFlight.current) return false;

      requestInFlight.current = true;
      setIsDeleting(true);
      setError(null);
      try {
        await request();
        return true;
      } catch (requestError) {
        setError(getDeleteErrorMessage(requestError));
        return false;
      } finally {
        requestInFlight.current = false;
        setIsDeleting(false);
      }
    },
    [],
  );

  const removeStory = useCallback(
    (storyId: string | number) => runDelete(() => deleteStory(storyId)),
    [runDelete],
  );

  const removeVerse = useCallback(
    (storyId: string | number, position: number) =>
      runDelete(() => deleteStoryVerse(storyId, position)),
    [runDelete],
  );

  const clearError = useCallback(() => setError(null), []);

  return { isDeleting, error, clearError, removeStory, removeVerse };
};
