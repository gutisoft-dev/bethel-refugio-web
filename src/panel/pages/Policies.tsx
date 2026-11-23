const policies = [
  {
    id: "service",
    title: "1. Sobre Mi Refugio",
    paragraphs: [
      "Mi Refugio es una aplicación web creada para compartir y descubrir versículos bíblicos mediante publicaciones en formato de historias.",
      "Actualmente nos encontramos en una etapa inicial de lanzamiento de prueba cerrada, con acceso limitado a usuarios invitados o autorizados. Durante este período, las funcionalidades pueden modificarse, mejorarse o suspenderse."
    ],
  },
  {
    id: "copyright",
    title: "2. Derechos de autor y uso del contenido",
    paragraphs: [
      "Mi Refugio incorpora contenido identificado como perteneciente a la traducción Reina-Valera 1960 (RVR1960). El archivo utilizado fue obtenido de fuentes disponibles en internet y actualmente no contamos con documentación que permita verificar su procedencia oficial.",
      
      "Reconocimiento de derechos: Texto bíblico Reina-Valera 1960® © Sociedades Bíblicas en América Latina, 1960. Derechos renovados 1988, Sociedades Bíblicas Unidas.",
      
      "Mi Refugio no reclama la propiedad del texto bíblico ni de los derechos asociados a esta traducción. Actualmente no contamos con una licencia ni autorización formal para reproducir o distribuir este contenido dentro de la aplicación.",
      
      "Hemos establecido contacto con la Sociedad Bíblica Boliviana y estamos realizando las gestiones correspondientes para solicitar la autorización de uso. Este proceso se encuentra pendiente de respuesta y aprobación, por lo que no constituye una licencia concedida ni una autorización vigente.",
      
      "El uso del contenido estará sujeto a las condiciones que establezcan los titulares de los derechos. Mi Refugio podrá limitar, suspender o retirar el contenido cuando corresponda."
    ],
  },
  {
    id: "data",
    title: "3. Información y privacidad",
    paragraphs: [
      "En esta etapa inicial, el único dato personal solicitado directamente al usuario para el registro y acceso es su dirección de correo electrónico, utilizada para verificar su cuenta mediante códigos de un solo uso (OTP).",
      "No solicitamos actualmente otros datos personales mediante formularios de registro.",
      "La plataforma puede generar registros técnicos necesarios para su funcionamiento, seguridad y prestación del servicio.",
      "El correo electrónico se utiliza para la gestión de la cuenta y los procesos de autenticación correspondientes."
    ],
  },
  {
    id: "stories",
    title: "4. Historias y publicaciones",
    paragraphs: [
      "Los usuarios pueden publicar uno o varios versículos bíblicos en formato de historias, con la posibilidad de añadir textos descriptivos.",
      "Las historias tienen una duración prevista de 24 horas y posteriormente pasan al estado de expiradas. Su autor también puede eliminarlas antes de ese momento.",
      "La expiración de una historia no implica necesariamente la eliminación inmediata de todos sus registros o archivos asociados.",
      "El feed de historias públicas todavía no se encuentra habilitado en esta etapa de lanzamiento."
    ],
  },
  {
    id: "interactions",
    title: "5. Visualizaciones e interacciones",
    paragraphs: [
      "Actualmente, la funcionalidad de interacción disponible es el registro de visualizaciones de historias.",
      "Las funcionalidades de reacciones a publicaciones todavía no se encuentran incorporadas.",
      "Las funcionalidades sociales podrán ampliarse progresivamente durante las siguientes etapas de desarrollo."
    ],
  },
  {
    id: "security",
    title: "6. Seguridad y uso de la plataforma",
    paragraphs: [
      "Los usuarios deben utilizar Mi Refugio de manera responsable y respetuosa.",
      "No está permitido utilizar la plataforma para actividades fraudulentas, suplantación de identidad, accesos no autorizados o acciones que perjudiquen su funcionamiento.",
      "Se aplican medidas técnicas razonables para proteger las cuentas y la información. Sin embargo, ningún servicio conectado a Internet puede garantizar seguridad absoluta."
    ],
  },
  {
    id: "account",
    title: "7. Cuentas y eliminación",
    paragraphs: [
      "El acceso a las funcionalidades privadas requiere una dirección de correo electrónico verificada.",
      "Los usuarios podrán solicitar la eliminación de su cuenta mediante los mecanismos habilitados en la aplicación.",
      "Determinados registros podrán conservarse cuando sea necesario por motivos técnicos, de seguridad u obligaciones legales, durante el tiempo que corresponda."
    ],
  },
  {
    id: "changes",
    title: "8. Actualizaciones de las políticas",
    paragraphs: [
      "Estas políticas podrán actualizarse conforme se incorporen nuevas funcionalidades, cambien las prácticas de tratamiento de información o existan nuevos requisitos legales.",
      "La versión vigente estará disponible en esta página. Recomendamos consultarla periódicamente."
    ],
  },
  {
    id: "contact",
    title: "9. Contacto",
    paragraphs: [
      "Para consultas relacionadas con Mi Refugio, privacidad o derechos de autor, los usuarios podrán comunicarse mediante los canales oficiales de contacto que habilite la plataforma."
    ],
  },
];
export const Policies = () => {
  return (
    <div className="min-h-screen bg-white text-[#171326]">
      <main className="mx-auto w-full max-w-270 px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
        {/* Encabezado */}
        <header className="mb-8 max-w-3xl sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[1.4px] text-[#7800c9]">
            Información legal
          </p>

          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Políticas de uso
          </h1>

          <p className="text-base leading-7 text-[#625d70] sm:text-lg">
            Información sobre privacidad, derechos de autor y condiciones
            de uso de nuestra plataforma.
          </p>

          <p className="mt-4 text-xs text-[#898496]">
            Última actualización: 19 de noviembre de 2026
          </p>
        </header>

        {/* Aviso de prueba cerrada */}
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 size-5 shrink-0 text-amber-700"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>

            <div>
              <h2 className="mb-1 text-sm font-bold text-amber-900">
                Lanzamiento de prueba cerrada
              </h2>
              <p className="text-sm leading-6 text-amber-800">
                Mi Refugio se encuentra en una etapa inicial de pruebas
                con acceso limitado. La autorización para el uso del
                texto bíblico Reina-Valera 1960 está actualmente en trámite.
              </p>
            </div>
          </div>
        </div>

        {/* Índice y contenido */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <nav
              aria-label="Índice de políticas"
              className="rounded-2xl border border-[#eeeaf3] bg-[#fcfbfd] p-4"
            >
              <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-[#898496]">
                Contenido
              </p>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                {policies.map((policy) => (
                  <a
                    key={policy.id}
                    href={`#${policy.id}`}
                    className="shrink-0 rounded-lg px-3 py-2 text-sm text-[#625d70] transition-colors hover:bg-[#f1e8fb] hover:text-[#7800c9] lg:shrink"
                  >
                    {policy.title}
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          <div className="min-w-0 divide-y divide-[#eeeaf3]">
            {policies.map((policy) => (
              <section
                key={policy.id}
                id={policy.id}
                className="scroll-mt-8 py-6 first:pt-0 sm:py-7"
              >
                <h2 className="mb-3 text-lg font-bold tracking-tight sm:text-xl">
                  {policy.title}
                </h2>

                <div className="space-y-3">
                  {policy.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-7 text-[#625d70] sm:text-[15px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* Cierre */}
            <div className="pt-7">
              <div className="rounded-2xl bg-[#f8f6fa] p-5 sm:p-6">
                <h2 className="mb-2 font-bold">
                  Gracias por formar parte de Mi Refugio
                </h2>
                <p className="text-sm leading-7 text-[#625d70]">
                  Seguimos trabajando para construir un espacio donde
                  podamos compartir y acercarnos a la Palabra de Dios.
                  Gracias por acompañarnos en esta etapa inicial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
