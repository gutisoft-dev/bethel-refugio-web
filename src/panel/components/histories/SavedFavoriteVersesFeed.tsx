import { Link } from "react-router-dom";
import { useAuthStore } from "@/auth/store/auth.store";
import { ContentFavoriteVeses } from "@/panel/components/social/ContentFavoriteVeses";
import { CURRENT_USER_FAVORITES_ID } from "@/panel/actions/social/FavoriteVerses";

export const SavedFavoriteVersesFeed = () => {
  const { authStatus } = useAuthStore();

  if (authStatus === "checking") {
    return (
      <p
        className="flex min-h-0 flex-1 items-center justify-center text-sm text-slate-500"
        role="status"
      >
        Verificando sesión…
      </p>
    );
  }

  if (authStatus !== "authenticated") {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-slate-600">
          Inicia sesión para ver tus versículos guardados.
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
    <section className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto  bg-slate-50 px-2 py-3 text-slate-900 sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <ContentFavoriteVeses id={CURRENT_USER_FAVORITES_ID} />
      </div>
    </section>
  );
};
