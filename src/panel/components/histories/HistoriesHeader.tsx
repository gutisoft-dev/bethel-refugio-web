import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HistoriasHeader = () => {
  return (
    <div className="mx-auto w-full space-y-3 lg:relative lg:left-1/2 lg:mx-0 lg:w-[60vw] lg:-translate-x-1/2">
      {/* Header principal */}
      <header className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          {/* Información */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 7v14" />
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4z" />
              </svg>
            </div>

            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-slate-800">
                Historias Bíblicas
              </h1>

              <p className="max-w-62.5 text-[10px] leading-tight text-slate-500">
                Versículos efímeros y devocionales activos por 24 horas
              </p>
            </div>
          </div>

          {/* Navegación */}
          <div className="flex shrink-0 items-center gap-1">
            <Button
              size="sm"
              className="h-8 rounded-md bg-purple-600 px-3 text-[11px] hover:bg-purple-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 h-3 w-3"
              >
                <path d="M12 7v14" />
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4z" />
              </svg>
              Público
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-[11px] text-slate-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 h-3 w-3"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Seguidos
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 gap-1 px-2 text-[10px] text-slate-600"
              aria-label="Más opciones, 2 nuevas"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <circle cx="5" cy="12" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
              </svg>

              <span>Más</span>
              <Badge className="absolute -right-0.5 -top-0.5 h-3 min-w-3 justify-center rounded-full bg-purple-100 px-1 text-[7px] text-purple-700">
                2
              </Badge>
            </Button>
          </div>
        </div>
      </header>

      {/* Encabezado del feed */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 text-purple-600"
          >
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594L2.814 12.983a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
            <path d="M20 2v4" />
            <path d="M22 4h-4" />
            <path d="M4 20v2" />
            <path d="M5 21H3" />
          </svg>

          <span className="text-xs font-semibold text-slate-700">
            Feed de Historias de la Comunidad
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          En vivo (24h)
        </div>
      </div>
    </div>
  );
};
