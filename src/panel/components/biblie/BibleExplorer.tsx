import { useEffect, useRef, useState, type FormEvent } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BibleExplorerProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export const BibleExplorer = ({
  onSearch,
  isSearching = false,
}: BibleExplorerProps) => {
  const [query, setQuery] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => onSearch(query), 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, onSearch]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearch(query);
  };

  return (
    <section className="w-full" aria-busy={isSearching}>

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

        <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
          Explorador de la Biblia
        </h1>

        <p className="mt-1 text-sm text-slate-600 md:text-base">
          Busca libros canónicos y versículos de las Sagradas Escrituras por
          referencia o concordancia textual.
        </p>
      </div>


      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5 md:p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSearch}>
            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative flex-1">
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
                  aria-label="Buscar en la Biblia"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder='Buscar versículo o referencia bíblica (ej. Juan 3:16, Salmos 23 o "amor")...'
                  className="
                    h-12
                    rounded-xl
                    border-slate-200
                    pl-12
                    pr-4
                    text-sm
                    shadow-sm
                    placeholder:text-slate-400
                    focus-visible:ring-2
                    focus-visible:ring-purple-500
                  "
                />
              </div>

              <Button
                type="submit"
                disabled={isSearching}
                className="
                  h-12
                  rounded-xl
                  bg-purple-700
                  px-7
                  font-semibold
                  text-white
                  hover:bg-purple-800
                  sm:min-w-34.5
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
  );
};
