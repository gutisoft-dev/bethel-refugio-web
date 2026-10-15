import { Badge } from "@/components/ui/badge";
import { useFollower } from "@/panel/hooks/useFollower";
import { ContentUser } from "./ContentUser";
import { ContentEmpty } from "./ContentEmpty";

interface Props {
  id: string;
}
export const ContentFollowers = ({ id }: Props) => {
  const { data } = useFollower(id);
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Resultados</h2>

          <Badge variant="secondary" className="rounded-full text-[10px]">
            {data?.results.length} Seguidores
          </Badge>
        </div>
      </div>
      <div className="grid gap-5">
        {data?.results.map((result) => (
          <ContentUser key={result.id} follower={result} title={'Seguidor'} subtitle={' Persona que siguen tu perfil'} />
        ))}
        {data?.results.length === 0 && (
          <ContentEmpty text="No hay seguidores" />
        )}
      </div>
    </div>
  );
};
