import { useEffect, useRef, useState, type FormEvent } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [query, setQuery] = useState("");
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
          {/* 
      <div className="mb-8">
        <Badge
          variant="secondary"
          className="
            mb-2
            gap-2
            rounded-full
            bg-purple-100
            px-3
            py-1
            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-purple-700
            hover:bg-purple-100
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
            aria-hidden="true"
          >
            <path d="M12 7v14" />
            <path d="M3 18a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4v13a4 4 0 0 0-4-4Z" />
            <path d="M21 18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4v13a4 4 0 0 1 4-4Z" />
          </svg>
          Biblia
        </Badge>

      </div> */}

          <Card className="mx-auto w-full max-w-7xl border-0 bg-white py-0 shadow-none ring-0">
            <CardContent className={isPinned ? "p-2" : "p-2 md:p-4"}>
              <form className="flex flex-col gap-4" onSubmit={handleSearch}>
                <div
                  className={
                    isPinned
                      ? "flex min-w-0 flex-row items-center gap-2"
                      : "flex flex-col gap-3 sm:flex-row"
                  }
                >
                  <div className="relative min-w-0 flex-1">
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
                      aria-hidden="true"
                      className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>

                    <Input
                      id="bible-search"
                      ref={searchInputRef}
                      aria-label="Buscar en la Biblia"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder='Buscar versículo o referencia bíblica (ej. Juan 3:16, Salmos 23 o "amor")...'
                      className={`${isPinned ? "h-10" : "h-12"}
                    rounded-xl
                    ${isPinned ? "border-transparent shadow-none" : "border-slate-200"}
                    pl-12
                    pr-10
                    text-sm
                    placeholder:text-slate-400
                    focus-visible:ring-2
                    focus-visible:ring-purple-500
                  `}
                    />
                    {query.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        aria-label="Limpiar búsqueda"
                        className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4"
                        >
                          <path d="m18 6-12 12M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSearching}
                    className={`${isPinned ? "h-10 min-w-0 px-3 sm:min-w-0" : "h-12 px-7 sm:min-w-34.5"}
                  rounded-xl
                  bg-purple-700
                  font-semibold
                  text-white
                  hover:bg-purple-800
                `}
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
                      aria-hidden="true"
                      className="mr-2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>

                    {isSearching ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
};
