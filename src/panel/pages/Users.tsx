import { useState } from "react";
import { ContentUser } from "../components/social/ContentUser";
import { SearchUser } from "../components/Users/SearchUser";
import { useSearchUser } from "../hooks/useSearchUser";

export const Users = () => {
  const [username, setUsername] = useState("");
  const { data, isFetching } = useSearchUser(username);
  return (
    <div className="mx-auto w-full  max-w-7xl mt-4">
      <div className="sticky top-0 z-20 bg-white">
        <SearchUser onSearch={setUsername} />
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Resultados de búsqueda
          </h2>
        </div>
      </div>
      <div>
        {isFetching && (
          <p
            className="mt-6 text-center text-sm text-slate-500"
            role="status"
            aria-live="polite"
          >
            Buscando Usuarios...
          </p>
        )}
      </div>

      <div>
        {data?.results.length === 0 && (
          <p
            className="mt-6 text-center text-sm text-slate-500"
            role="status"
            aria-live="polite"
          >
            No se encontraron Usuarios
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2">
        {data?.results.map((result) => (
          <ContentUser
            key={result.id}
            follower={result}
            title={"Usuario"}
            subtitle={" Persona que quizas conozcas"}
          />
        ))}
      </div>
    </div>
  );
};
