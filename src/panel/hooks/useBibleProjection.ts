import { useCallback, useEffect, useState } from "react";
import type { BibleVerse } from "../actions/biblie/search.action";

interface ProjectionSelection {
  verse: BibleVerse;
  index: number;
}

export const useBibleProjection = (query: string, results: BibleVerse[]) => {
  const [selection, setSelection] = useState<ProjectionSelection | null>(null);
  const isSequence = selection !== null && results.length > 1;

  const project = useCallback(
    (verse: BibleVerse) => {
      const index = results.findIndex(
        (result) => result.normalized_reference === verse.normalized_reference,
      );
      setSelection({ verse, index: index >= 0 ? index : 0 });
    },
    [results],
  );

  const close = useCallback(() => setSelection(null), []);

  const previous = useCallback(() => {
    setSelection((current) => {
      if (!current || current.index <= 0) return current;
      const index = current.index - 1;
      return { index, verse: results[index] };
    });
  }, [results]);

  const next = useCallback(() => {
    setSelection((current) => {
      if (
        !current ||
        current.index >= results.length - 1
      ) {
        return current;
      }
      const index = current.index + 1;
      return { index, verse: results[index] };
    });
  }, [results]);

  useEffect(() => {
    close();
  }, [query, close]);

  return {
    projectedVerse: selection?.verse ?? null,
    projectionIndex: selection?.index ?? 0,
    isSequence,
    project,
    close,
    previous,
    next,
  };
};
