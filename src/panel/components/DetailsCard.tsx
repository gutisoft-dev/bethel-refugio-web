import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HistoriesCard } from "./histories/HistoriesCard";
import type { HistoryFeed } from "./histories/HistoriesHeader";
import type { PublicStory } from "../actions/history/story.action";
import { Close } from "@/icons/Close";

interface Props{
   feed: HistoryFeed
 selectedStoryId: string | null
  stories: PublicStory[]
   nextCursor: string | null
  handleSelectedStoryId: (id: string | null) => void
  handleStoryContentDeleted: (storyId: string, position?: number) => void
}


export const DetailsCard = ({ selectedStoryId,handleSelectedStoryId,handleStoryContentDeleted,feed,stories, nextCursor }: Props ) => {
  return (
    <Dialog
      open={selectedStoryId !== null}
      onOpenChange={(open) => {
        if (!open) handleSelectedStoryId(null);
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/85 backdrop-blur-xl supports-backdrop-filter:backdrop-blur-xl"
        className="fixed! inset-0! left-0! top-0! z-60! grid! h-dvh! w-screen! max-w-none! translate-x-0! translate-y-0! gap-0! rounded-none! border-0! bg-transparent! p-0! text-white! shadow-none! ring-0! sm:max-w-none!"
      >
        <DialogTitle className="sr-only">Historia</DialogTitle>
        <DialogClose
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Cerrar historia"
              className="cursor-pointer absolute right-5 top-5 z-70 size-11 rounded-full bg-black/70 text-white ring-1 ring-white/20 transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-8 sm:top-8"
            />
          }
        >
          <Close/>
        </DialogClose>
        {selectedStoryId && (
          <HistoriesCard
            key={`${feed}-${selectedStoryId}`}
            feed={feed}
            initialStoryId={selectedStoryId}
            initialStories={stories}
            initialCursor={nextCursor}
            onStoryContentDeleted={handleStoryContentDeleted}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
