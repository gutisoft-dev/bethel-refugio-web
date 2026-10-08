import { useEffect, useState } from "react";
import {
  getStoriesPublic,
  type PublicStory,
} from "@/panel/actions/history/storyPublic";

interface Historia {
  id: string;
  initials: string;
  author: string;
  username: string;
  reference: string;
  verse: string;
  description: string | null;
  position: number;
  totalVerses: number;
  remaining: string;
}

const getRemainingTime = (expiresAt: string) => {
  const expiresAtMs = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtMs)) return "Historia pública";

  const remainingHours = Math.max(
    0,
    Math.ceil((expiresAtMs - Date.now()) / (1000 * 60 * 60)),
  );

  return `Quedan ${remainingHours}h`;
};

const toSlides = (stories: PublicStory[]): Historia[] =>
  stories.flatMap((story) => {
    const username = story.user.username.replace(/^@/, "").trim() || "usuario";
    const author = username;
    const initials = username.slice(0, 2).toLocaleUpperCase("es");
    const verses = [...story.verses].sort(
      (first, second) => first.position - second.position,
    );

    return verses.map((item, index) => ({
      id: `${story.id}-${item.position}`,
      initials,
      author,
      username,
      reference: item.verse.reference || item.verse.normalized_reference,
      verse: item.verse.text,
      description: item.caption,
      position: index + 1,
      totalVerses: verses.length,
      remaining: getRemainingTime(story.expires_at),
    }));
  });

export const HistoriasCards = () => {
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    const loadStories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getStoriesPublic();
        if (!isCurrent) return;

        setHistorias(toSlides(response.results));
        setActiveIndex(0);
      } catch {
        if (!isCurrent) return;

        setError("No se pudieron cargar las historias públicas.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    void loadStories();

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  const goPrevious = () => {
    setActiveIndex((index) =>
      historias.length ? (index + historias.length - 1) % historias.length : 0,
    );
  };

  const goNext = () => {
    setActiveIndex((index) =>
      historias.length ? (index + 1) % historias.length : 0,
    );
  };

  const totalSlides = historias.length;

  useEffect(() => {
    if (totalSlides < 2) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, [contenteditable='true']")
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index + totalSlides - 1) % totalSlides);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % totalSlides);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);

  const current = historias[activeIndex];
  const previous = historias.length
    ? historias[(activeIndex + historias.length - 1) % historias.length]
    : undefined;
  const next = historias.length
    ? historias[(activeIndex + 1) % historias.length]
    : undefined;

  return (
    <section
      className="relative flex h-full min-h-0 w-full flex-col justify-center overflow-hidden bg-slate-50 px-2 py-3 text-slate-900 sm:px-4"
      aria-label="Historias bíblicas públicas"
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center" role="status">
          <p className="text-sm font-medium text-slate-600">
            Cargando historias públicas…
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-slate-700" role="alert">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="rounded-md bg-purple-700 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
          >
            Reintentar
          </button>
        </div>
      ) : !current ? (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-sm text-slate-600">
            Aún no hay historias públicas para mostrar.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 w-full flex-1 items-center justify-center px-1 sm:px-2">
          <div className="flex h-full w-full items-center justify-center gap-2 sm:gap-4 lg:gap-5">
            {historias.length > 1 && previous && (
              <button
                type="button"
                onClick={goPrevious}
                aria-label={`Ver historia anterior de ${previous.author}`}
                className="group relative hidden h-[min(420px,100%)] w-[min(165px,18vw)] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1022]/70 p-3 text-left text-white opacity-50 transition hover:opacity-80 lg:flex"
              >
                <span className="flex items-center gap-2 text-[9px] font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-[8px] text-slate-900">
                    {previous.initials}
                  </span>
                  <span className="truncate">{previous.author}</span>
                </span>
                <span className="mt-1 text-[8px] text-white/50">
                  {previous.reference}
                </span>
                <span className="mt-auto line-clamp-3 text-center text-[10px] italic text-white/60">
                  “{previous.verse}”
                </span>
                <span className="mt-8 rounded-full bg-black/20 px-2 py-1 text-center text-[8px] text-white/60">
                  Anterior
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={goPrevious}
              aria-label="Historia anterior"
              disabled={historias.length < 2}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <article
              aria-label={`Historia de ${current.author}: ${current.reference}`}
              className="relative flex h-[min(590px,100%)] min-h-0 w-[min(390px,calc(100vw-28px))] shrink-0 flex-col overflow-hidden rounded-[22px] border border-purple-300/30 bg-linear-to-b from-[#310b48] via-[#4c0877] to-[#110c17] text-white shadow-[0_0_38px_rgba(98,24,145,0.24)]"
            >
              <div className="flex gap-1 px-3 pt-2.5" aria-hidden="true">
                {Array.from({ length: current.totalVerses }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-0.75 flex-1 rounded-full ${index < current.position ? "bg-white" : "bg-white/25"}`}
                  />
                ))}
              </div>

              <header className="flex items-center justify-between gap-2 px-3 pt-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-purple-300 bg-white/10 text-[10px] font-bold">
                    {current.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold">
                      {current.author}
                    </p>
                    <p className="truncate text-[8px] text-white/60">
                      @{current.username} · {current.remaining}
                    </p>
                  </div>
                </div>
              </header>

              <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 pb-2 text-center">
                <span className="mb-4 inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-purple-200/20 bg-purple-200/10 px-3 py-1 text-[9px] font-semibold text-purple-100">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3 w-3 shrink-0 text-amber-300"
                  >
                    <path d="M7.17 6A4.17 4.17 0 0 0 3 10.17V18h7v-7H6.2A1.2 1.2 0 0 1 7.4 9.8H9V6H7.17Zm10 0A4.17 4.17 0 0 0 13 10.17V18h7v-7h-3.8a1.2 1.2 0 0 1 1.2-1.2H19V6h-1.83Z" />
                  </svg>
                  {current.reference}
                </span>
                <div className="relative pr-5">
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 left-0 text-3xl font-black text-purple-200/40"
                  >
                    ”
                  </span>
                  <blockquote className="font-serif text-[22px] font-semibold italic leading-tight text-white">
                    “{current.verse}”
                  </blockquote>
                </div>
                {current.description && (
                  <>
                    <div className="my-4 h-px w-10 bg-purple-200/30" />
                    <p className="max-w-72.5 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-[12px] leading-[1.45] text-white/85">
                      {current.description}
                    </p>
                  </>
                )}
              </div>
            </article>

            <button
              type="button"
              onClick={goNext}
              aria-label="Historia siguiente"
              disabled={historias.length < 2}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {historias.length > 1 && next && (
              <button
                type="button"
                onClick={goNext}
                aria-label={`Ver historia siguiente de ${next.author}`}
                className="group relative hidden h-[min(420px,100%)] w-[min(165px,18vw)] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1022]/70 p-3 text-left text-white opacity-50 transition hover:opacity-80 lg:flex"
              >
                <span className="flex items-center gap-2 text-[9px] font-semibold">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-[8px] text-slate-900">
                    {next.initials}
                  </span>
                  <span className="truncate">{next.author}</span>
                </span>
                <span className="mt-1 text-[8px] text-white/50">
                  {next.reference}
                </span>
                <span className="mt-auto line-clamp-3 text-center text-[10px] italic text-white/60">
                  “{next.verse}”
                </span>
                <span className="mt-8 rounded-full bg-black/20 px-2 py-1 text-center text-[8px] text-white/60">
                  Siguiente
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export { HistoriasCards as HistoriesCard };
