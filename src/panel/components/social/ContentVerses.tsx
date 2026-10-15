import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Verses } from "@/panel/interfaces/FavoriteVeses.inferface";

interface Props {
  result: Verses;
}

export const ContentVerses = ({ result }: Props) => {
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
          ></div>
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
