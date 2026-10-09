import { useEffect, useRef, useState } from "react";
import { useBibleProjection } from "../hooks/useBibleProjection";
import { useBibleSearch } from "../hooks/useBibleSearch";
import { BibleExplorer } from "../components/biblie/BibleExplorer";
import { BibleProjectionModal } from "../components/biblie/BibleProjectionModal";
import { BibleResults } from "../components/biblie/BiblieResults";
import type { StoryVisibilityOption } from "../components/biblie/AddBibleVerseToStoryDialog";
import type { BibleVersePileItem } from "../components/biblie/bibleVersePile";
import { PublishBibleStoryPileDialog } from "../components/biblie/PublishBibleStoryPileDialog";

const storyVisibilityOptions: StoryVisibilityOption[] = [
  { value: "public", label: "Pública" },
  { value: "followers", label: "Seguidores" },
];

export const Biblie = () => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [versePile, setVersePile] = useState<BibleVersePileItem[]>([]);
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

  const addVerseToPile = (item: BibleVersePileItem) => {
    setVersePile((currentPile) => {
      const existingIndex = currentPile.findIndex(
        (currentItem) =>
          currentItem.verse.normalized_reference ===
          item.verse.normalized_reference,
      );

      if (existingIndex < 0) return [...currentPile, item];

      return currentPile.map((currentItem, index) =>
        index === existingIndex ? item : currentItem,
      );
    });
  };

  const removeVerseFromPile = (normalizedReference: string) => {
    setVersePile((currentPile) =>
      currentPile.filter(
        (item) => item.verse.normalized_reference !== normalizedReference,
      ),
    );
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

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-slate-50 p-5 shadow-[0_0_0_100vmax_#f8fafc] [clip-path:inset(0_-100vmax)] md:p-8">
      <div className="mx-auto max-w-7xl">
        <BibleExplorer onSearch={search} isSearching={isSearching} />

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
