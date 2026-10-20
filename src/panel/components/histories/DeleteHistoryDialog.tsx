import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteHistoryDialogProps {
  open: boolean;
  isDeleting: boolean;
  error: string | null;
  hasMultipleVerses: boolean;
  canDeleteCurrentVerse: boolean;
  onOpenChange: (open: boolean) => void;
  onClearError: () => void;
  onDeleteStory: () => void;
  onDeleteVerse: () => void;
}

export const DeleteHistoryDialog = ({
  open,
  isDeleting,
  error,
  hasMultipleVerses,
  canDeleteCurrentVerse,
  onOpenChange,
  onClearError,
  onDeleteStory,
  onDeleteVerse,
}: DeleteHistoryDialogProps) => (
  <AlertDialog
    open={open}
    onOpenChange={(nextOpen) => {
      if (isDeleting) return;
      onOpenChange(nextOpen);
      if (!nextOpen) onClearError();
    }}
  >
    <AlertDialogContent
      overlayClassName="z-[80] bg-black/75 backdrop-blur-md"
      className="z-81 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-sm gap-4 overflow-y-auto rounded-2xl border border-[#393647] bg-[#171625] p-4 text-white shadow-2xl sm:p-5"
    >
      <AlertDialogHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-1 items-start gap-3 text-left">
        <span className="grid size-10 place-items-center rounded-xl border border-red-500/35 bg-red-500/10 text-red-500">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="m19 6-1 14H6L5 6" />
            <path d="M10 11v5M14 11v5" />
          </svg>
        </span>
        <div className="grid min-w-0 gap-1 pt-0.5">
          <AlertDialogTitle className="text-base font-semibold tracking-tight text-white sm:text-lg">
            ¿Estás seguro de eliminar?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-white/65">
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Cerrar confirmación"
          disabled={isDeleting}
          onClick={() => {
            onClearError();
            onOpenChange(false);
          }}
          className="size-8 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-4"
          >
            <path d="m18 6-12 12M6 6l12 12" />
          </svg>
        </Button>
      </AlertDialogHeader>

      {hasMultipleVerses && (
        <p className="text-xs leading-relaxed text-white/50">
          Los versículos se eliminan desde el último hacia el primero.
        </p>
      )}
      {error && (
        <p
          className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <AlertDialogCancel
          disabled={isDeleting}
          onClick={onClearError}
          className="h-10 w-full rounded-lg border-white/15 bg-white/4 text-sm text-white hover:bg-white/10 hover:text-white"
        >
          Cancelar
        </AlertDialogCancel>
        {hasMultipleVerses && (
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting || !canDeleteCurrentVerse}
            onClick={onDeleteVerse}
            title={
              canDeleteCurrentVerse
                ? undefined
                : "Elimina primero los versículos posteriores."
            }
            className="h-auto min-h-10 w-full min-w-0 rounded-lg border-red-500/35 bg-red-500/5 px-2 text-xs font-semibold leading-tight whitespace-normal hover:bg-red-500/15 hover:text-white disabled:opacity-45"
          >
            {isDeleting ? "Eliminando…" : "Eliminar versículo"}
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting}
          onClick={onDeleteStory}
          className={`h-10 w-full min-w-0 gap-2 rounded-lg bg-[#c7191c] px-2 text-xs font-semibold leading-tight whitespace-normal text-white hover:bg-[#a90f12] sm:text-sm ${hasMultipleVerses ? "sm:col-span-2" : ""}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 shrink-0 sm:size-5"
          >
            <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m5 5v5m4-5v5" />
          </svg>
          <span className="min-w-0 wrap-break-word text-center">
            {isDeleting ? "Eliminando…" : "Eliminar historia"}
          </span>
        </Button>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);
