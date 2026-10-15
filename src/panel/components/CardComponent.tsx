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
      className={`histories-grid-card group relative aspect-3/4 w-full overflow-hidden rounded-[1.35rem] border border-primary-foreground/15 p-4 text-left text-primary-foreground transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 ${isExpired ? "cursor-not-allowed opacity-55 grayscale" : "cursor-pointer hover:-translate-y-1 hover:border-primary-foreground/35"}`}
    >
      <span
        className="histories-grid-card-overlay pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      {isExpired && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80">
         <Block/>
          Bloqueada
        </span>
      )}
      <div className="relative flex h-full flex-col justify-between">
        <div
          className={`flex min-w-0 items-center gap-2 ${isExpired ? "pr-20" : ""}`}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold ring-1 ring-white/50 backdrop-blur-sm">
            {username.slice(0, 2).toLocaleUpperCase("es")}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              @{username}
            </span>
            {timeAgo && (
              <span className="flex items-center gap-1 text-xs text-white/75">
                <Clock/>
                {timeAgo}
              </span>
            )}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5 text-base font-semibold text-white">
          <Book/>
          <span className="truncate">{reference}</span>
        </div>
      </div>
    </article>
  );
};
