export const HistoriasLoader = () => {
  return (
    <div className="mx-auto mt-3 flex w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-4 lg:relative lg:left-1/2 lg:mx-0 lg:w-[60vw] lg:-translate-x-1/2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mb-1.5 h-4 w-4 animate-spin text-purple-600"
      >
        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594L2.814 12.983a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
        <path d="M20 2v4" />
        <path d="M22 4h-4" />
        <path d="M4 20v2" />
        <path d="M5 21H3" />
      </svg>

      <p className="text-[11px] font-medium text-purple-600">
        Cargando más historias bíblicas...
      </p>

      <p className="mt-1 text-[9px] text-slate-400">
        Historias devocionales públicas compartidas por la comunidad en las
        últimas 24 horas.
      </p>
    </div>
  );
};
