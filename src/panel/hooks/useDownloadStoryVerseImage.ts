import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/toast";
import { getStoryVerseImage } from "../actions/history/story.action";

interface ImageApiError {
  detail?: string;
  message?: string;
  error?: { message?: string };
}

const getErrorMessage = async (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    if (responseData instanceof Blob) {
      try {
        const payload = (await responseData.text()) as string;
        const parsed = JSON.parse(payload) as ImageApiError;
        return (
          parsed.error?.message ??
          parsed.detail ??
          parsed.message ??
          "No se pudo descargar la imagen. Inténtalo de nuevo."
        );
      } catch {
        // Use the generic message below if the response is not JSON.
      }
    }

    return "No se pudo descargar la imagen. Inténtalo de nuevo.";
  }

  return error instanceof Error
    ? error.message
    : "No se pudo descargar la imagen. Inténtalo de nuevo.";
};

const getImageExtension = (mimeType: string) => {
  if (mimeType.includes("jpeg")) return "jpg";
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("gif")) return "gif";
  return "png";
};

const toFileName = (reference: string, extension: string) => {
  const safeReference = reference
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `historia-${safeReference || "biblica"}.${extension}`;
};

export const useDownloadStoryVerseImage = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const requestInFlight = useRef(false);

  const downloadImage = useCallback(
    async (
      storyId: string,
      position: number,
      reference: string,
    ): Promise<void> => {
      if (requestInFlight.current) return;

      requestInFlight.current = true;
      setIsDownloading(true);
      let objectUrl: string | null = null;

      try {
        const result = await getStoryVerseImage(storyId, position);
        const blob =
          result.type === "blob"
            ? result.blob
            : await fetchImageBlob(result.url);

        if (blob.size === 0) {
          throw new Error("La imagen descargada está vacía.");
        }

        if (
          blob.type &&
          !blob.type.startsWith("image/") &&
          blob.type !== "application/octet-stream"
        ) {
          throw new Error("El servicio no devolvió un archivo de imagen.");
        }

        objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = toFileName(
          reference,
          getImageExtension(blob.type),
        );
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        toast.add({
          type: "success",
          description: `Se descargó la imagen de ${reference}.`,
          priority: "high",
          timeout: 3500,
        });
      } catch (error) {
        toast.add({
          type: "error",
          description: await getErrorMessage(error),
          priority: "high",
          timeout: 4500,
        });
      } finally {
        const urlToRevoke = objectUrl;
        if (urlToRevoke) {
          window.setTimeout(() => URL.revokeObjectURL(urlToRevoke), 1000);
        }
        requestInFlight.current = false;
        setIsDownloading(false);
      }
    },
    [],
  );

  return { isDownloading, downloadImage };
};

const fetchImageBlob = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo descargar la imagen. Inténtalo de nuevo.");
  }
  return response.blob();
};
