import type { Historia } from "@/panel/interfaces/History.interface";

interface HistoryPreviewCardProps {
  story: Historia;
  label: "Anterior" | "Siguiente";
  onClick: () => void;
}

export const HistoryPreviewCard = ({
  story,
  label,
  onClick,
}: HistoryPreviewCardProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Ver historia ${label.toLowerCase()} de ${story.author}`}
    className="histories-grid-card group relative hidden h-[min(520px,100%)] w-[min(195px,18vw)] shrink-0 flex-col overflow-hidden rounded-xl border border-primary-foreground/10 p-3 text-left text-primary-foreground opacity-50 transition hover:opacity-80 lg:flex"
  >
    <span className="flex items-center gap-2 text-[9px] font-semibold">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-[8px] text-slate-900">
        {story.initials}
      </span>
      <span className="truncate">{story.author}</span>
    </span>
    <span className="mt-1 text-[8px] text-white/50">{story.reference}</span>
    <span className="mt-auto line-clamp-3 text-center text-[10px] italic text-white/60">
      “{story.verse}”
    </span>
    <span className="mt-8 rounded-full bg-black/20 px-2 py-1 text-center text-[8px] text-white/60">
      {label}
    </span>
  </button>
);
