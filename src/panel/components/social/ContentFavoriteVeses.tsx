import { Badge } from "@/components/ui/badge";
import { useFavoriteVerses } from "@/panel/hooks/useFavoriteVerses";
import { ContentVerses } from "./ContentVerses";
import { ContentEmpty } from "./ContentEmpty";

interface Props {
  id: string;
}

export const ContentFavoriteVeses = ({ id }: Props) => {
  const { data } = useFavoriteVerses(id);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Resultados</h2>

          <Badge variant="secondary" className="rounded-full text-[10px]">
            {data?.results.length} versículos
          </Badge>
        </div>
      </div>
      <div className="grid gap-5">
        {data?.results.map((result) => (
          <ContentVerses key={result.normalized_reference} result={result} />
        ))}
        {data?.results.length === 0 && (
          <ContentEmpty text="No tienes versiculos favoritos" />
        )}
      </div>
    </div>
  );
};
