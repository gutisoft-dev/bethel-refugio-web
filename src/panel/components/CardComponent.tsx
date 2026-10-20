import { Block } from "@/icons/Block";
import type { PublicStory } from "../actions/history/story.action";
import { Clock } from "@/icons/Clock";
import { Book } from "@/icons/Book";

interface Props {
  story: PublicStory;
  isExpired: boolean;
  reference: string;
  username: string;
  timeAgo: string
  handleSelectedStoryId: (id: string) => void;
}

export const CardComponent = ({
  story,
  isExpired,
  reference,
  handleSelectedStoryId,
  username,
  timeAgo
}: Props) => {
  return (
    <article
      key={story.id}
      role={isExpired ? undefined : "button"}
      tabIndex={isExpired ? undefined : 0}
      aria-disabled={isExpired || undefined}
      aria-label={`${isExpired ? "Historia bloqueada" : "Abrir historia"}: ${reference}`}
      onClick={isExpired ? undefined : () => handleSelectedStoryId(story.id)}
      onKeyDown={(event) => {
        if (isExpired) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelectedStoryId(story.id);
        }
      }}
      className={`histories-grid-card group relative aspect-[3/4] w-full min-w-0 overflow-hidden rounded-2xl border border-primary-foreground/15 p-2.5 text-left text-primary-foreground transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 sm:rounded-[1.35rem] sm:p-4 ${isExpired ? "cursor-not-allowed opacity-55 grayscale" : "cursor-pointer hover:-translate-y-1 hover:border-primary-foreground/35"}`}
    >
      <span
        className="histories-grid-card-overlay pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      {isExpired && (
        <span className="absolute right-2 top-10 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white/80 sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
         <Block />
          Bloqueada
        </span>
      )}
      <div className="relative flex h-full flex-col justify-between">
        <div
          className="flex min-w-0 items-center gap-1.5 sm:gap-2"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold ring-1 ring-white/50 backdrop-blur-sm sm:size-9 sm:text-xs">
            {username.slice(0, 2).toLocaleUpperCase("es")}
          </span>
          <span className="min-w-0">
            <span className="block max-w-full truncate text-[11px] font-semibold leading-tight sm:text-sm">
              @{username}
            </span>
            {timeAgo && (
              <span className="flex min-w-0 items-center gap-1 text-[9px] leading-tight text-white/75 sm:text-xs">
                <Clock />
                <span className="truncate">{timeAgo}</span>
              </span>
            )}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-1 text-[13px] font-semibold leading-tight text-white sm:gap-1.5 sm:text-base">
          <span className="shrink-0 [&_svg]:size-4"><Book /></span>
          <span className="truncate">{reference}</span>
        </div>
      </div>
    </article>
  );
};
