import { Button } from "@/components/ui/button";
import { Market } from "@/icons/Market";
import { Save } from "@/icons/Save";
import { UserAdd } from "@/icons/UserAdd";
import { useAuthStore } from "@/auth/store/auth.store";

export type HistoryFeed = "public" | "following" | "saved" | "mine";

interface HistoriasHeaderProps {
  activeFeed: HistoryFeed;
  onFeedChange: (feed: HistoryFeed) => void;
}

const tabs = [
  { label: "Público", feed: "public", icon: <Market /> },
  { label: "Seguidos", feed: "following", icon: <UserAdd /> },
  { label: "Guardados", feed: "saved", icon: <Save /> },
  { label: "Mis Historias", feed: "mine", icon: null },
] as const;

export const HistoriasHeader = ({
  activeFeed,
  onFeedChange,
}: HistoriasHeaderProps) => (
  <HistoryHeaderContent activeFeed={activeFeed} onFeedChange={onFeedChange} />
);

const HistoryHeaderContent = ({ activeFeed, onFeedChange }: HistoriasHeaderProps) => {
  const { authStatus } = useAuthStore();

  return (
  <header className="z-40 flex w-full min-w-0 items-center justify-center px-3 py-3 text-slate-900 sticky top-0">
    <nav
      aria-label="Secciones de historias"
      className="pointer-events-auto flex w-full max-w-md min-w-0 items-center gap-0 overflow-hidden rounded-full border border-slate-200 bg-slate-50 p-1 shadow-sm sm:w-auto sm:gap-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.feed === activeFeed;
        const isSavedDisabled = tab.feed === "saved" && authStatus !== "authenticated";

        return (
        <Button
          key={tab.feed}
          type="button"
          variant="ghost"
          size="sm"
          disabled={isSavedDisabled}
          onClick={() => onFeedChange(tab.feed)}
          aria-current={isActive ? "page" : undefined}
          className={`h-7 min-w-0 flex-1 gap-1 whitespace-nowrap rounded-full px-1 text-[9px] sm:flex-none sm:gap-2 sm:px-3 sm:text-[10px] [&_svg]:hidden sm:[&_svg]:inline-flex ${
            isActive
              ? "bg-purple-700 text-white hover:bg-purple-600"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50"
          }`}
          aria-label={isSavedDisabled ? "Inicia sesión para ver tus versículos guardados" : tab.label}
        >
          {tab.icon}
          {tab.label}
        </Button>
        );
      })}
    </nav>
  </header>
  );
};

export { HistoriasHeader as HistoriesHeader };
