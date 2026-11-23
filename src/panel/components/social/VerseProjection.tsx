import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Left } from "@/icons/Left";
import type { Verses } from "@/panel/interfaces/FavoriteVeses.inferface";
import { useEffect, useRef, useState } from "react";

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
  const projectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || verses.length === 0) return;

    const index = verses.findIndex(
      (item) => item.reference === verse.reference,
    );

    setCurrentIndex(index >= 0 ? index : 0);
  }, [open, verse.reference, verses]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      projectionRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  const handleNext = () => {
    if (verses.length === 0) return;

    setCurrentIndex((prev) => (prev + 1) % verses.length);
  };

  const handlePrevious = () => {
    if (verses.length === 0) return;

    setCurrentIndex((prev) => (prev - 1 + verses.length) % verses.length);
  };

  const currentVerse = verses[currentIndex];

  const touchStart = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];

    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;

    const minSwipeDistance = 50;

    if (
      Math.abs(deltaX) < minSwipeDistance ||
      Math.abs(deltaX) < Math.abs(deltaY)
    ) {
      return;
    }

    if (deltaX < 0) {
      handleNext();
    } else {
      handlePrevious();
    }
  };

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

        <div
          ref={projectionRef}
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              handleNext();
            }

            if (event.key === "ArrowLeft") {
              event.preventDefault();
              handlePrevious();
            }
          }}
          className="relative flex h-dvh w-screen flex-col overflow-hidden"
        >
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
              <Left />
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
                    text-[11px]  tracking-wide
                    text-white hover:bg-purple-700/80
                  "
                >
                  ● {currentVerse.reference} - (RVR1960)
                </Badge>

                <div
                  key={currentVerse.reference}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
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
                        select-none text-4xl font-medium leading-[1.18]
                        tracking-tight text-white
                        md:text-5xl lg:text-6xl xl:text-7xl
                      "
                    >
                      «{currentVerse.text}»
                    </p>
                  </div>
                </div>
                <div>
                  <p className="mt-4  block w-full min-w-0 max-w-md px-2 text-center text-[10px] leading-relaxed text-white/60 sm:text-xs">
                    Texto bíblico Reina-Valera 1960® © Sociedades Bíblicas en
                    América Latina, 1960. Derechos renovados 1988, Sociedades
                    Bíblicas Unidas.
                  </p>
                </div>
              </div>

              {/* Controles flotantes */}
              {/* <div
                className="
                absolute bottom-6 right-5 z-30
                flex flex-col items-center gap-3
              "
              >
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
                  <Up />
                </Button>

                <span
                  className="
                  rounded-full bg-black/40 px-3 py-1
                  text-xs font-medium text-white
                "
                >
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
                  <Down />
                </Button>
              </div> */}

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
                    onClick={handlePrevious}
                    className="
                    h-7
                    text-[10px]
                    text-black
                    bg-white
                    cursor-pointer
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

                    <span className="text-[9px] text-slate-400">
                      Usa las flechas
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={currentIndex === verses.length - 1}
                    onClick={handleNext}
                    className="
                    h-7
                    text-[10px]
                   text-black
                    bg-white
                    cursor-pointer
                  "
                  >
                    Siguiente →
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div
              className="
              flex flex-1 items-center justify-center px-6
              text-center text-white/70
            "
            >
              No tienes versículos favoritos para proyectar.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
