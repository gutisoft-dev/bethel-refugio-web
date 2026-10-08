import { Button } from "@/components/ui/button";

export interface CommunityUser {
  id: string;
  name: string;
  initials: string;
  color: string;
  active?: boolean;
}

interface HistoriesCommunityProps {
  users?: CommunityUser[];
  selectedUserId?: string;
  onUserChange?: (user: CommunityUser) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

const defaultUsers: CommunityUser[] = [
  {
    id: "mateo",
    name: "Mateo D.",
    initials: "MD",
    color: "bg-purple-600",
    active: true,
  },
  {
    id: "sara",
    name: "Sara R.",
    initials: "SR",
    color: "bg-rose-500",
  },
  {
    id: "david",
    name: "David Pastor",
    initials: "DP",
    color: "bg-emerald-600",
  },
  {
    id: "ester",
    name: "Ester Lucas",
    initials: "EL",
    color: "bg-blue-600",
  },
];

export const HistoriesCommunity = ({
  users = defaultUsers,
  selectedUserId = "mateo",
  onUserChange,
  onPrevious,
  onNext,
}: HistoriesCommunityProps) => {
  return (
      <div className="flex w-full justify-center bg-slate-50 px-3 py-2">
        <div className="mx-auto flex w-full max-w-[655px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm">
      {/* Label */}
      <span className="mr-1 shrink-0 text-[8px] font-bold uppercase tracking-wide text-slate-500">
        Comunidad:
      </span>

      {/* Users */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        {users.map((user) => {
          const selected = selectedUserId === user.id;

          return (
            <Button
              key={user.id}
              type="button"
              variant="ghost"
              onClick={() => onUserChange?.(user)}
              className={[
                "h-8 shrink-0 rounded-lg px-2 text-[9px]",
                "border border-transparent text-slate-600",
                "hover:bg-slate-100 hover:text-slate-950",
                selected
                  ? "border-purple-500/40 bg-purple-700 text-white hover:bg-purple-700"
                  : "",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-5 w-5 items-center justify-center rounded-full text-[7px] font-bold text-white",
                  user.color,
                ].join(" ")}
              >
                {user.initials}
              </span>

              <span className="ml-1.5 truncate">{user.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="mx-1 h-7 w-px bg-slate-200" />

      {/* Navigation */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          className="h-7 w-7 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
          aria-label="Historia anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="h-7 w-7 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
          aria-label="Historia siguiente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </div>
        </div>
      </div>
  );
};
