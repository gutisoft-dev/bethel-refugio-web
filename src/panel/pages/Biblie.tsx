import { useEffect, useRef, useState } from "react";
import { useBibleProjection } from "../hooks/useBibleProjection";
import { useBibleSearch } from "../hooks/useBibleSearch";
import { BibleExplorer } from "../components/biblie/BibleExplorer";
import { BibleProjectionModal } from "../components/biblie/BibleProjectionModal";
import { BibleResults } from "../components/biblie/BiblieResults";
import type { StoryVisibilityOption } from "../components/biblie/AddBibleVerseToStoryDialog";
import type { BibleVersePileItem } from "../components/biblie/bibleVersePile";
import { PublishBibleStoryPileDialog } from "../components/biblie/PublishBibleStoryPileDialog";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/auth/store/auth.store";
import { toast } from "@/components/ui/toast";

const BIBLE_STORY_PILE_STORAGE_KEY = "bible-story-pile";

const isBibleVersePileItem = (value: unknown): value is BibleVersePileItem => {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Partial<BibleVersePileItem>;
  const verse = item.verse;

  return (
    typeof item.caption === "string" &&
    typeof verse?.reference === "string" &&
    typeof verse.normalized_reference === "string" &&
    typeof verse.text === "string" &&
    typeof verse.chapter === "number" &&
    typeof verse.verse === "number" &&
    typeof verse.book?.slug === "string" &&
    typeof verse.book.name === "string"
  );
};

const getSavedVersePile = (): BibleVersePileItem[] => {
  try {
    const savedPile = localStorage.getItem(BIBLE_STORY_PILE_STORAGE_KEY);
    if (!savedPile) return [];

    const parsedPile: unknown = JSON.parse(savedPile);
    return Array.isArray(parsedPile)
      ? parsedPile.filter(isBibleVersePileItem)
      : [];
  } catch {
    return [];
  }
};

const storyVisibilityOptions: StoryVisibilityOption[] = [
  { value: "public", label: "Pública" },
  { value: "followers", label: "Seguidores" },
];

export const Biblie = () => {
  const { authStatus } = useAuthStore();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [versePile, setVersePile] =
    useState<BibleVersePileItem[]>(getSavedVersePile);
  const {
    results,
    query,
    totalResults,
    isSearching,
    isLoadingMore,
    hasSearched,
    searchError,
    hasNext,
    loadMoreError,
    search,
    loadNextPage,
  } = useBibleSearch();
  const projection = useBibleProjection(query, results);

  useEffect(() => {
    try {
      if (versePile.length === 0) {
        localStorage.removeItem(BIBLE_STORY_PILE_STORAGE_KEY);
        return;
      }

      localStorage.setItem(
        BIBLE_STORY_PILE_STORAGE_KEY,
        JSON.stringify(versePile),
      );
    } catch {
      //
    }
  }, [versePile]);

  const addVerseToPile = (item: BibleVersePileItem): boolean => {
    const existingIndex = versePile.findIndex(
      (currentItem) =>
        currentItem.verse.normalized_reference ===
        item.verse.normalized_reference,
    );
    let shouldPrepend = false;

    if (existingIndex < 0 && versePile.length > 0) {
      const firstVerse = versePile[0].verse;
      const lastVerse = versePile[versePile.length - 1].verse;
      const isSameBookAndChapter =
        item.verse.book.slug === firstVerse.book.slug &&
        item.verse.chapter === firstVerse.chapter &&
        item.verse.book.slug === lastVerse.book.slug &&
        item.verse.chapter === lastVerse.chapter;
      const isPreviousVerse =
        isSameBookAndChapter && item.verse.verse === firstVerse.verse - 1;
      const isNextVerse =
        isSameBookAndChapter && item.verse.verse === lastVerse.verse + 1;

      if (!isPreviousVerse && !isNextVerse) {
        const expectedReferences = [
          ...(firstVerse.verse > 1
            ? [`${firstVerse.book.name} ${firstVerse.chapter}:${firstVerse.verse - 1}`]
            : []),
          `${lastVerse.book.name} ${lastVerse.chapter}:${lastVerse.verse + 1}`,
        ];

        toast.add({
          type: "error",
          description: `Agrega un versículo consecutivo: ${expectedReferences.join(" o ")}.`,
          priority: "high",
          timeout: 4000,
        });
        return false;
      }

      shouldPrepend = isPreviousVerse;
    }

    setVersePile((currentPile) => {
      const currentIndex = currentPile.findIndex(
        (currentItem) =>
          currentItem.verse.normalized_reference ===
          item.verse.normalized_reference,
      );

      if (currentIndex < 0) {
        return shouldPrepend ? [item, ...currentPile] : [...currentPile, item];
      }

      return currentPile.map((currentItem, index) =>
        index === currentIndex ? item : currentItem,
      );
    });
    return true;
  };

  const removeVerseFromPile = (normalizedReference: string) => {
    setVersePile((currentPile) => {
      const itemIndex = currentPile.findIndex(
        (item) => item.verse.normalized_reference === normalizedReference,
      );
      const isAtPileEdge =
        itemIndex === 0 || itemIndex === currentPile.length - 1;

      if (!isAtPileEdge) return currentPile;

      return currentPile.filter(
        (item) => item.verse.normalized_reference !== normalizedReference,
      );
    });
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void loadNextPage();
      },
      { rootMargin: "500px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNext, loadNextPage]);

  if (authStatus === "checking") {
    return (
      <div className="flex min-h-[calc(100dvh-3.5rem)] items-start justify-center bg-slate-50 px-4 pt-8 text-center sm:pt-10">
        <p className="text-sm text-slate-500" role="status">
          Verificando sesión…
        </p>
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    return (
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-start gap-3 bg-slate-50 px-4 pt-8 text-center sm:pt-10">
        <p className="text-sm text-slate-600">
          Inicia sesión para consultar la Biblia.
        </p>
        <Link
          to="/auth/login"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-slate-50 p-5 md:p-8 pt-1">
      <div className="mx-auto max-w-7xl">
        <BibleExplorer
          onSearch={search}
          isSearching={isSearching}
          hasResults={results.length > 0}
        />

        {isSearching && (
          <p
            className="mt-6 text-center text-sm text-slate-500"
            role="status"
            aria-live="polite"
          >
            Buscando versículos...
          </p>
        )}

        {hasSearched && !isSearching && results.length === 0 && (
          <p
            className="mt-6 text-center text-sm text-slate-600"
            role="status"
            aria-live="polite"
          >
            {searchError
              ? "No se pudo completar la búsqueda. Inténtalo de nuevo."
              : "No se encontraron versículos para esta búsqueda."}
          </p>
        )}

        {results.length > 0 && (
          <BibleResults
            results={results}
            query={query}
            totalResults={totalResults}
            loadedResults={results.length}
            isLoadingMore={isLoadingMore}
            hasNext={hasNext}
            loadMoreError={loadMoreError}
            sentinelRef={sentinelRef}
            onProject={projection.project}
            onRetryLoadMore={loadNextPage}
            storyVisibilityOptions={storyVisibilityOptions}
            versePile={versePile}
            onAddVerseToPile={addVerseToPile}
          />
        )}

        <PublishBibleStoryPileDialog
          items={versePile}
          onRemove={removeVerseFromPile}
          onClear={() => setVersePile([])}
          onPublished={() => setVersePile([])}
        />

        <BibleProjectionModal
          verse={projection.projectedVerse}
          open={projection.projectedVerse !== null}
          onClose={projection.close}
          isSequence={projection.isSequence}
          currentIndex={projection.projectionIndex}
          totalSequence={results.length}
          onPrevious={projection.previous}
          onNext={projection.next}
        />
      </div>
    </div>
  );
};
