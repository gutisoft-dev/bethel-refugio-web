import { Badge } from "@/components/ui/badge";

interface Historia {
  id: string;
  initials: string;
  author: string;
  username: string;
  role: string;
  verified?: boolean;
  reference: string;
  version: string;
  verse: string;
  description: string;
  likes: number;
  comments: number;
  views: number;
  remaining: string;
  tone: "purple" | "slate";
}

const historias: Historia[] = [
  {
    id: "HIST-8842",
    initials: "MD",
    author: "Mateo Devocional",
    username: "@mateo_devocional",
    role: "Historia 1 de 3",
    verified: true,
    reference: "Filipenses 4:13",
    version: "RVR1960",
    verse: "Todo lo puedo en Cristo que me fortalece.",
    description:
      "Mi versículo de aliento para hoy al enfrentar nuevos retos en la congregación. Que su gracia sea suficiente en cada paso.",
    likes: 89,
    comments: 142,
    views: 1204,
    remaining: "Quedan 18h",
    tone: "purple",
  },
  {
    id: "HIST-8843",
    initials: "SR",
    author: "Sara Rut",
    username: "@sara_rut_estudios",
    role: "Historia 2 de 4",
    verified: false,
    reference: "Jeremías 29:11",
    version: "RVR1960",
    verse:
      "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal.",
    description:
      "Descansando en su perfecta voluntad y propósito soberano. Aunque el camino sea incierto, sus planes son bendición y esperanza.",
    likes: 144,
    comments: 210,
    views: 1890,
    remaining: "Quedan 16h",
    tone: "purple",
  },
  {
    id: "HIST-8844",
    initials: "DP",
    author: "David Pastor",
    username: "@david_p",
    role: "Historia 1 de 2",
    verified: false,
    reference: "Proverbios 3:5-6",
    version: "RVR1960",
    verse:
      "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.",
    description:
      "Para tomar decisiones sabias este fin de semana en familia y ministerio. Dejemos que Él guíe nuestro rumbo.",
    likes: 110,
    comments: 188,
    views: 1530,
    remaining: "Quedan 20h",
    tone: "slate",
  },
];

export const HistoriasCards = () => {
  return (
    <div className="mx-auto w-full space-y-3 lg:relative lg:left-1/2 lg:mx-0 lg:w-[60vw] lg:-translate-x-1/2">
      {historias.map((historia) => (
        <article
          key={historia.id}
          className={`overflow-hidden rounded-lg border border-white/20 text-white shadow-md ${
            historia.tone === "purple"
              ? "bg-gradient-to-b from-[#4b0879] via-[#350657] to-[#160d20]"
              : "bg-gradient-to-b from-[#494949] via-[#333333] to-[#171717]"
          }`}
        >
          {/* Progreso de las historias de esta publicación */}
          <div className="flex gap-[3px] px-2 pt-2" aria-hidden="true">
            {Array.from({ length: Number(historia.role.match(/de (\d+)/)?.[1] ?? 1) }).map((_, index) => (
              <span
                key={index}
                className={`h-[2px] flex-1 rounded-full ${index === 0 ? "bg-white" : "bg-white/35"}`}
              />
            ))}
          </div>

          {/* Usuario */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-purple-800">
                {historia.initials}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                    <span className="truncate text-xs font-semibold">
                    {historia.author}
                  </span>

                  {historia.verified && (
                    <Badge className="rounded-full bg-purple-200/20 px-1.5 py-0 text-[8px] text-purple-100">
                      Verificado
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[9px] text-purple-200">
                  <span>{historia.username}</span>
                  <span>•</span>
                  <span>{historia.role}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <Badge className="bg-purple-700 px-1.5 py-0.5 text-[8px]">
                #{historia.id}
              </Badge>
              <span className="flex items-center gap-1 text-[9px] text-purple-200">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {historia.remaining}
              </span>
            </div>
          </div>

          {/* Versículo */}
          <div className={`mx-3 rounded-lg p-3 ${historia.tone === "purple" ? "bg-[#25063b]/75" : "bg-black/35"}`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                  <path d="M7.17 6A4.17 4.17 0 0 0 3 10.17V18h7v-7H6.2A1.2 1.2 0 0 1 7.4 9.8H9V6H7.17Zm10 0A4.17 4.17 0 0 0 13 10.17V18h7v-7h-3.8a1.2 1.2 0 0 1 1.2-1.2H19V6h-1.83Z" />
                </svg>
                {historia.reference}
              </span>

              <Badge className="bg-slate-700 px-1.5 py-0.5 text-[8px]">
                {historia.version}
              </Badge>
            </div>

            <blockquote className="border-l-2 border-white pl-2 text-xs font-medium italic leading-[1.5]">
              "{historia.verse}"
            </blockquote>

            <p className="mt-2 text-[10px] leading-[1.45] text-slate-300">
              {historia.description}
            </p>
          </div>

          {/* Acciones */}
          <div className="mt-2 flex items-center justify-between border-t border-white/10 px-3.5 py-2.5">
            <div className="flex items-center gap-3.5">
              <button className="flex items-center gap-1 text-[9px] text-slate-300 transition hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />{" "}
                </svg>
                {historia.comments}
              </button>

              <button className="flex items-center gap-1 text-[9px] text-slate-300 transition hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  {" "}
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />{" "}
                </svg>

                {historia.likes}
              </button>

              <button className="flex items-center gap-1 text-[9px] text-slate-300 transition hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  {" "}
                  <circle cx="18" cy="5" r="3" />{" "}
                  <circle cx="6" cy="12" r="3" />{" "}
                  <circle cx="18" cy="19" r="3" />{" "}
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />{" "}
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />{" "}
                </svg>
                Compartir
              </button>
            </div>

            <div className="flex items-center gap-1 text-[9px] text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                {" "}
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />{" "}
                <circle cx="12" cy="12" r="3" />{" "}
              </svg>
              {historia.views.toLocaleString()} vistas
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
