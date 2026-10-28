import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "@/icons/ChevronLeft";
import { ChevronRight } from "@/icons/ChevronRight";
import {
  bibleSuggestions,
  type BibleSuggestion,
} from "@/panel/helpers/suggestions";

interface SuggestionsProps {
  onSelect?: (suggestion: BibleSuggestion) => void;
}

export const Suggestions = ({ onSelect }: SuggestionsProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedSlug, setSelectedSlug] = useState("all");

  const selectSuggestion = (suggestion: BibleSuggestion) => {
    setSelectedSlug(suggestion.slug);
    onSelect?.(suggestion);
  };

  const scroll = (direction: -1 | 1) => {
    listRef.current?.scrollBy({
      left: direction * Math.max(listRef.current.clientWidth * 0.7, 220),
      behavior: "smooth",
    });
  };

  return (
    <nav
      aria-label="Sugerencias de búsqueda bíblica"
      className="mx-auto flex w-full max-w-7xl items-center gap-1.5 sm:gap-3"
    >
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label="Desplazar sugerencias a la izquierda"
        onClick={() => scroll(-1)}
        className="hidden  cursor-pointer size-11 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100 lg:inline-flex"
      >
        <ChevronLeft className="size-5" />
      </Button>

      <div
        ref={listRef}
        role="group"
        aria-label="Categorías"
        className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 scrollbar-none [&::-webkit-scrollbar]:hidden sm:gap-2.5"
      >
        {bibleSuggestions.map((suggestion) => {
          const isSelected = selectedSlug === suggestion.slug;

          return (
            <button
              key={suggestion.slug}
              type="button"
              aria-pressed={isSelected}
              onClick={() => selectSuggestion(suggestion)}
              className={`shrink-0 cursor-pointer rounded-xl px-2 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 sm:px-2.5 sm:py-1.5 sm:text-lg ${
                isSelected
                  ? "bg-purple-700 text-white shadow-sm hover:bg-purple-800"
                  : "bg-slate-200/80 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {suggestion.name}
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label="Desplazar sugerencias a la derecha"
        onClick={() => scroll(1)}
        className="hidden  cursor-pointer size-11 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100 lg:inline-flex"
      >
        <ChevronRight className="size-5" />
      </Button>
    </nav>
  );
};
