import { useEffect, useRef, useState, type FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "@/icons/Search";
import { Close } from "@/icons/Close";
import { Suggestions } from "./Suggestions";
import { bibleSuggestions } from "@/panel/helpers/suggestions";

const BIBLE_SEARCH_STORAGE_KEY = "bible-search-query";

const getStoredSearchQuery = () => {
  try {
    return window.localStorage.getItem(BIBLE_SEARCH_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

const getMatchingSuggestionSlug = (value: string) =>
  bibleSuggestions.find((suggestion) => suggestion.slug === value.trim())
    ?.slug ?? "";

interface BibleExplorerProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  hasResults?: boolean;
}

export const BibleExplorer = ({
  onSearch,
  isSearching = false,
  hasResults = false,
}: BibleExplorerProps) => {
  const [query, setQuery] = useState(getStoredSearchQuery);
  const [selectedSuggestionSlug, setSelectedSuggestionSlug] = useState(() =>
    getMatchingSuggestionSlug(getStoredSearchQuery()),
  );
  const [isPinned, setIsPinned] = useState(false);
  const [stickyHeight, setStickyHeight] = useState(0);
  const stickySentinelRef = useRef<HTMLDivElement | null>(null);
  const explorerRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextEmptySearchRef = useRef(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!hasResults || !sentinel) {
      setIsPinned(false);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        const shouldPin =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        if (shouldPin && explorerRef.current) {
          setStickyHeight(explorerRef.current.getBoundingClientRect().height);
        }
        setIsPinned(shouldPin);
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasResults]);

  useEffect(() => {
    if (query) {
      window.localStorage.setItem(BIBLE_SEARCH_STORAGE_KEY, query);
    } else {
      window.localStorage.removeItem(BIBLE_SEARCH_STORAGE_KEY);
    }
  }, [query]);

  useEffect(() => {
    if (skipNextEmptySearchRef.current) {
      skipNextEmptySearchRef.current = false;
      if (!query) return;
    }

    timeoutRef.current = setTimeout(() => onSearch(query), 700);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, onSearch]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearch(query);
  };

  const handleClearSearch = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    skipNextEmptySearchRef.current = true;
    setIsPinned(false);
    setQuery("");
    setSelectedSuggestionSlug("");
    onSearch("");
    searchInputRef.current?.focus();
  };

  return (
    <>
      {hasResults && (
        <div ref={stickySentinelRef} aria-hidden="true" className="h-px" />
      )}
      <div
        className="w-full"
        style={isPinned ? { height: stickyHeight } : undefined}
      >
        <section
          ref={explorerRef}
          className={
            isPinned
              ? "fixed inset-x-0 top-0 z-40 w-full bg-white px-5 md:px-8"
              : "w-full py-3"
          }
          aria-busy={isSearching}
        >
          <form
            onSubmit={handleSearch}
            className={`mx-auto w-full max-w-7xl ${isPinned ? "p-2" : "py-3"}`}
          >
            <div
              className={`flex w-full min-w-0 items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-purple-500/30 ${isPinned ? "h-11" : "h-14"}`}
            >
              <Search className="ml-5 size-5 shrink-0 text-slate-400" />
              <Input
                id="bible-search"
                ref={searchInputRef}
                aria-label="Buscar en la Biblia"
                value={query}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setQuery(nextQuery);
                  setSelectedSuggestionSlug(getMatchingSuggestionSlug(nextQuery));
                }}
                placeholder="Buscar versículo o referencia bíblica..."
                className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-4 text-base shadow-none placeholder:text-slate-400 focus-visible:border-0 focus-visible:ring-0 md:text-base"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Limpiar búsqueda"
                  className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <Close className="size-4" />
                </button>
              )}
              <Button
                type="submit"
                disabled={isSearching}
                className={`h-full shrink-0 rounded-none rounded-r-[0.9rem] bg-purple-700 px-5 font-semibold text-white hover:bg-purple-800 sm:px-7 ${isPinned ? "text-sm" : "text-base"}`}
              >
                <Search className="mr-2 size-4" />
                {/* {isSearching ? "Buscando..." : "Buscar"} */}
              </Button>
            </div>
          </form>
          <Suggestions
            selectedSlug={selectedSuggestionSlug}
            onSelect={(suggestion) => {
              setQuery(suggestion.slug);
              setSelectedSuggestionSlug(suggestion.slug);
            }}
          />
        </section>
      </div>
    </>
  );
};
