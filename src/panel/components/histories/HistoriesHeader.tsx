import { Button } from "@/components/ui/button";

export type HistoryFeed = "public" | "following" | "mine";

interface HistoriasHeaderProps {
  activeFeed: HistoryFeed;
  onFeedChange: (feed: HistoryFeed) => void;
}

const tabs = ["Público", "Seguidos", "Guardados", "Mis Historias"];

export const HistoriasHeader = ({
  activeFeed,
  onFeedChange,
}: HistoriasHeaderProps) => (
  <header className="relative z-10 flex w-full items-center justify-center bg-slate-50 px-3 py-3 text-slate-900">
    <nav
      aria-label="Secciones de historias"
      className="pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-slate-200 bg-slate-50 p-1 shadow-sm"
    >
      {tabs.map((tab, index) => {
        const feed =
          index === 0
            ? "public"
            : index === 1
              ? "following"
              : index === 3
                ? "mine"
                : null;
        const isActive = feed === activeFeed;

        return (
        <Button
          key={tab}
          type="button"
          variant="ghost"
          size="sm"
          disabled={!feed}
          onClick={() => feed && onFeedChange(feed)}
          aria-current={isActive ? "page" : undefined}
          className={`h-7 shrink-0 rounded-full px-3 text-[10px] ${
            isActive
              ? "bg-purple-700 text-white hover:bg-purple-600"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50"
          }`}
        >
          {index === 0 && (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-3 w-3"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m16 8-2 6-6 2 2-6 6-2Z" />
            </svg>
          )}
          {index === 1 && (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-3 w-3"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="10" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
          )}
          {index === 2 && (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-3 w-3"
            >
              <path d="M6 4h12v17l-6-4-6 4z" />
            </svg>
          )}
          {/* {index === 3 && (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-3 w-3"
            >
              <path d="M3 11v3a2 2 0 0 0 2 2h1l4 4V5l-4 4H5a2 2 0 0 0-2 2Z" />
              <path d="M16 9a5 5 0 0 1 0 7" />
              <path d="M19 5a10 10 0 0 1 0 15" />
            </svg>
          )} */}
          {tab}
        </Button>
        );
      })}
    </nav>
  </header>
);

export { HistoriasHeader as HistoriesHeader };
