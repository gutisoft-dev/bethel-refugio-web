
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Down } from "@/icons/Down";
import { Left } from "@/icons/Left";
import { Up } from "@/icons/Up";
import type { Verses } from "@/panel/interfaces/FavoriteVeses.inferface";
import { useEffect, useState } from "react";


interface ProjectionProps {
  open: boolean;
  onClose: () => void;
  verse: Verses;
  verses: Verses[];
}

export function VerseProjection({
  open,
  onClose,
  verse,
  verses,
}: ProjectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!open || verses.length === 0) return;

    const index = verses.findIndex(
      (item) => item.reference === verse.reference
    );

    setCurrentIndex(index >= 0 ? index : 0);
  }, [open, verse.reference, verses]);

  const handleNext = () => {
    if (verses.length === 0) return;

    setCurrentIndex((prev) => (prev + 1) % verses.length);
  };

  const handlePrevious = () => {
    if (verses.length === 0) return;

    setCurrentIndex(
      (prev) => (prev - 1 + verses.length) % verses.length
    );
  };

  const currentVerse = verses[currentIndex];

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent
        className="
          !fixed !inset-0 !left-0 !top-0 !z-[9999]
          !h-screen !w-screen !max-w-none
          !translate-x-0 !translate-y-0
          !rounded-none !border-0 !bg-[#29292f]
          !p-0 !text-white !shadow-none
          [&>button]:hidden
        "
      >
        <DialogTitle className="sr-only">
          Proyección de versículos favoritos
        </DialogTitle>

        <div className="relative flex h-dvh w-screen flex-col overflow-hidden">
          {/* Botón para salir */}
          <div className="absolute left-5 top-4 z-30">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="
                h-8 cursor-pointer bg-white px-2
                text-[11px] text-black
              "
            >
              <Left  />
              Salir de Proyección
            </Button>
          </div>

          {currentVerse ? (
            <>
              <div className="flex min-h-0 flex-1 flex-col items-center px-6 pb-24 pt-16">
                <Badge
                  className="
                    mb-5 shrink-0 rounded-full border-0
                    bg-purple-700/80 px-4 py-1.5
                    text-[11px] uppercase tracking-wide
                    text-white hover:bg-purple-700/80
                  "
                >
                  ● {currentVerse.reference}
                </Badge>

                <div
                  key={currentVerse.reference}
                  className="
                    min-h-0 w-full max-w-5xl flex-1
                    overflow-y-auto overscroll-contain
                    text-center
                    [scrollbar-color:rgba(255,255,255,0.35)_transparent]
                    scrollbar-thin
                  "
                >
                  <div className="flex min-h-full items-center justify-center py-3">
                    <p
                      className="
                        text-4xl font-medium leading-[1.18]
                        tracking-tight text-white
                        md:text-5xl lg:text-6xl xl:text-7xl
                      "
                    >
                      «{currentVerse.text}»
                    </p>
                  </div>
                </div>
              </div>

              {/* Controles flotantes */}
              <div className="
                absolute bottom-6 right-5 z-30
                flex flex-col items-center gap-3
              ">
                <Button
                  type="button"
                  onClick={handlePrevious}
                  aria-label="Versículo anterior"
                  title="Versículo anterior"
                  className="
                    size-12 rounded-full border border-white/20
                    bg-white/10 p-0 text-white shadow-lg
                    backdrop-blur-md hover:bg-white/20
                  "
                >
                  <Up  />
                </Button>

                <span className="
                  rounded-full bg-black/40 px-3 py-1
                  text-xs font-medium text-white
                ">
                  {currentIndex + 1} / {verses.length}
                </span>

                <Button
                  type="button"
                  onClick={handleNext}
                  aria-label="Siguiente versículo"
                  title="Siguiente versículo"
                  className="
                    size-12 rounded-full border border-white/20
                    bg-white/10 p-0 text-white shadow-lg
                    backdrop-blur-md hover:bg-white/20
                  "
                >
                  <Down  />
                </Button>
              </div>
            </>
          ) : (
            <div className="
              flex flex-1 items-center justify-center px-6
              text-center text-white/70
            ">
              No tienes versículos favoritos para proyectar.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
