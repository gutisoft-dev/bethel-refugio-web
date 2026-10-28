import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Projector } from "@/icons/Projector";
import type { Verses } from "@/panel/interfaces/FavoriteVeses.inferface";

interface Props {
  index: number;
  result: Verses;
  onOpen: (index: number) => void;
  onOpenDeleted: (references: string) => void;
}

export const ContentVerses = ({
  index,
  result,
  onOpen,
  onOpenDeleted,
}: Props) => {
  return (
    <Card
      className="
                overflow-hidden
                border-slate-200
                border-l-[3px]
                border-l-purple-600
                shadow-sm
              "
    >
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Badge
              className="
                        rounded-full
                        bg-purple-100
                        px-2.5
                        py-0.5
                        text-[9px]
                        font-medium
                        text-purple-700
                        hover:bg-purple-100
                      "
            >
              {result.normalized_reference}
            </Badge>
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label={`Acciones para ${result.reference}`}
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen(index)}
                    className="
                            h-7
                            rounded-md
                            border-purple-300
                            px-3
                            text-[10px]
                            text-purple-700
                            hover:bg-purple-50
                          "
                  >
                    <Projector className="mr-1.5 size-[13px]" />
                    Proyectar
                  </Button>
                }
              />

              <TooltipContent>Proyectar versículo</TooltipContent>
            </Tooltip>
            <Button
              variant={"destructive"}
              onClick={() => onOpenDeleted(result.normalized_reference)}
            >
              Eliminar
            </Button>
          </div>
        </div>

        <div className="mt-4 border-l border-purple-300 pl-3">
          <p className="text-xl italic leading-6 text-slate-700">
            "{result.text}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
