import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/auth/store/auth.store";
import { ContentFavoriteVeses } from "@/panel/components/social/ContentFavoriteVeses";
import {
  CURRENT_USER_FAVORITES_ID,
  getMyFavoriteVerses,
} from "@/panel/actions/social/FavoriteVerses";
import { useFavoriteVerses } from "@/panel/hooks/useFavoriteVerses";
import type { FavoriteVersesInterfacesTs } from "@/panel/interfaces/FavoriteVeses.inferface";

export const SavedFavoriteVersesFeed = () => {
  const { authStatus } = useAuthStore();
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageError, setPageError] = useState(false);
  const { data } = useFavoriteVerses(
    CURRENT_USER_FAVORITES_ID,
    authStatus === "authenticated",
  );

  const loadNextPage = async () => {
    if (!data?.next || loadingMoreRef.current) return;
    const cursor = data.next;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    setPageError(false);

    try {
      const page = await getMyFavoriteVerses(cursor);
      queryClient.setQueryData<FavoriteVersesInterfacesTs>(
        ["favorite-verses", CURRENT_USER_FAVORITES_ID],
        (current) => {
          if (!current) return page;
          const existingReferences = new Set(
            current.results.map((verse) => verse.normalized_reference),
          );
          const newResults = page.results.filter(
            (verse) => !existingReferences.has(verse.normalized_reference),
          );

          return {
            ...page,
            previous: current.previous,
            results: [...current.results, ...newResults],
          };
        },
      );
    } catch {
      setPageError(true);
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const root = scrollContainerRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel || !data?.next || pageError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void loadNextPage();
      },
      { root, rootMargin: "220px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [data?.next, pageError]);

  if (authStatus === "checking") {
    return (
      <p className="flex min-h-0 flex-1 items-center justify-center text-sm text-slate-500" role="status">
        Verificando sesión…
      </p>
    );
  }

  if (authStatus !== "authenticated") {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-slate-600">Inicia sesión para ver tus versículos guardados.</p>
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
    <section ref={scrollContainerRef} className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50 px-2 py-3 text-slate-900 sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <ContentFavoriteVeses id={CURRENT_USER_FAVORITES_ID} />
        <div ref={sentinelRef} className="flex min-h-14 items-center justify-center py-4" aria-live="polite">
          {isLoadingMore && <p className="text-sm text-slate-500" role="status">Cargando más versículos guardados…</p>}
          {pageError && !isLoadingMore && (
            <div className="flex items-center gap-3" role="alert">
              <span className="text-sm text-red-700">No se pudieron cargar más versículos.</span>
              <button type="button" onClick={() => void loadNextPage()} className="text-sm font-semibold text-primary underline">
                Reintentar
              </button>
            </div>
          )}
          {!data?.next && !isLoadingMore && data?.results.length ? (
            <p className="text-xs text-slate-400">Has llegado al final de tus versículos guardados.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};
