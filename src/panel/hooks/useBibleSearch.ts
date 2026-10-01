import { useCallback, useEffect, useRef, useState } from "react";
import {
  searchBibleVerses,
  type BibleVerse,
} from "../actions/biblie/search.action";

export const useBibleSearch = () => {
  const [results, setResults] = useState<BibleVerse[]>([]);
  const [query, setQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  const queryRef = useRef("");
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasNextRef = useRef(false);
  const requestIdRef = useRef(0);
  const requestControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === queryRef.current && loadingRef.current) return;

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    const requestId = ++requestIdRef.current;
    loadingRef.current = false;
    setIsLoadingMore(false);
    setLoadMoreError(false);
    setSearchError(false);
    setResults([]);
    setTotalResults(0);
    setHasNext(false);
    hasNextRef.current = false;
    pageRef.current = 1;
    setHasSearched(false);
    queryRef.current = trimmedQuery;
    setQuery(trimmedQuery);

    if (!trimmedQuery) {
      setIsSearching(false);
      return;
    }

    loadingRef.current = true;
    setIsSearching(true);
    try {
      const response = await searchBibleVerses(trimmedQuery, 1, controller.signal);
      if (requestId !== requestIdRef.current) return;
      setResults(response.data);
      setTotalResults(response.pagination.total);
      pageRef.current = response.pagination.page;
      setHasNext(response.pagination.has_next);
      hasNextRef.current = response.pagination.has_next;
      setHasSearched(true);
    } catch (error) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) return;
      console.error("Error buscando versículos:", error);
      setSearchError(true);
      setHasSearched(true);
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setIsSearching(false);
      }
    }
  }, []);

  const loadNextPage = useCallback(async () => {
    const currentQuery = queryRef.current;
    if (!currentQuery || loadingRef.current || !hasNextRef.current) return;

    const requestId = requestIdRef.current;
    const controller = new AbortController();
    requestControllerRef.current = controller;
    loadingRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(false);

    try {
      const response = await searchBibleVerses(
        currentQuery,
        pageRef.current + 1,
        controller.signal,
      );
      if (requestId !== requestIdRef.current || currentQuery !== queryRef.current) return;
      setResults((previous) => {
        const knownReferences = new Set(previous.map((verse) => verse.normalized_reference));
        return [...previous, ...response.data.filter((verse) => !knownReferences.has(verse.normalized_reference))];
      });
      setTotalResults(response.pagination.total);
      pageRef.current = response.pagination.page;
      setHasNext(response.pagination.has_next);
      hasNextRef.current = response.pagination.has_next;
    } catch (error) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) return;
      console.error("Error cargando más versículos:", error);
      setLoadMoreError(true);
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => () => requestControllerRef.current?.abort(), []);

  return {
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
  };
};
