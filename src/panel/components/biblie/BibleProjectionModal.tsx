import type { BibleVerse } from "@/panel/actions/biblie/search.action";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

interface BibleProjectionModalProps {
  verse: BibleVerse | null;
  open: boolean;
  onClose: () => void;

  isSequence?: boolean;
  currentIndex?: number;
  totalSequence?: number;

  onPrevious?: () => void;
  onNext?: () => void;
}

export const BibleProjectionModal = ({
  verse,
  open,
  onClose,
  isSequence = false,
  currentIndex = 0,
  totalSequence = 0,
  onPrevious,
  onNext,
}: BibleProjectionModalProps) => {
  useEffect(() => {
    if (!open || !isSequence) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious?.();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext?.();
      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isSequence, onPrevious, onNext]);

  if (!verse) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="
          !fixed
          !inset-0
          !left-0
          !top-0
          !z-[9999]
          !h-screen
          !w-screen
          !max-w-none
          !translate-x-0
          !translate-y-0
          !rounded-none
          !border-0
          !bg-[#29292f]
          !p-0
          !text-white
          !shadow-none
          [&>button]:hidden
        "
      >
        <DialogTitle className="sr-only">
          Proyección de {verse.reference}
        </DialogTitle>

        <div className="relative flex h-screen w-screen flex-col overflow-hidden">

          <div className="absolute left-5 top-4 z-20">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="
                h-8
                px-2
                text-[11px]
                text-slate-400
                hover:bg-white/5
                hover:text-white
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
                className="mr-1.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
              Salir de Proyección
            </Button>
          </div>


          <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-16">
            <Badge
              className="
                mb-5
                rounded-full
                border-0
                bg-purple-700/80
                px-4
                py-1.5
                text-[11px]
                uppercase
                tracking-wide
                text-white
                hover:bg-purple-700/80
              "
            >
              ● {verse.reference}
              <Separator
                orientation="vertical"
                className="mx-2 h-3 bg-purple-300"
              />
              REINA-VALERA 1960
            </Badge>

            <div className="w-full max-w-5xl text-center">
              <p
                className="
                  text-4xl
                  font-medium
                  leading-[1.18]
                  tracking-tight
                  text-white
                  md:text-5xl
                  lg:text-6xl
                  xl:text-7xl
                "
              >
                «{verse.text}»
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2" aria-live="polite" aria-atomic="true">
              <Badge
                variant="outline"
                className="
                  border-0
                  bg-transparent
                  text-[10px]
                  text-white
                "
              >
                {isSequence
                  ? `Versículo ${currentIndex + 1} de ${totalSequence}`
                  : "Versículo"}
              </Badge>
            </div>
          </div>

          {isSequence && (
            <div className="absolute bottom-5 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
              <div
                className="
                  flex
                  h-9
                  items-center
                  justify-between
                  rounded-full
                  border
                  border-white/10
                  bg-[#29292f]
                  px-2
                  shadow-lg
                "
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={onPrevious}
                  className="
                    h-7
                    text-[10px]
                    text-slate-300
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  ← Anterior
                </Button>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-slate-700 text-[8px] text-slate-300"
                  >
                    ←
                  </Badge>

                  <Badge
                    variant="secondary"
                    className="bg-slate-700 text-[8px] text-slate-300"
                  >
                    →
                  </Badge>

                  <span className="text-[9px] text-slate-400">Usa las flechas ← →</span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={currentIndex >= totalSequence - 1}
                  onClick={onNext}
                  className="
                    h-7
                    text-[10px]
                    text-slate-300
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  Siguiente →
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
