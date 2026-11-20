
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { BookOpen } from "@/icons/BookOpen";
import { CheckCircle2 } from "@/icons/CheckCircle2";
import { FileCheck2 } from "@/icons/FileCheck2";
import { Mail } from "@/icons/Mail";
import { LockKeyhole } from "@/icons/LockKeyhole";

const styles = {
  page: "min-h-screen text-[#171326]",
  container:
    "mx-auto w-full max-w-6xl px-5 pb-12 pt-9 sm:px-8 sm:pb-16 sm:pt-14",
  eyebrow:
    "mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#7800c9]",
  heading:
    "mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl",
  description:
    "max-w-3xl text-base leading-relaxed text-[#625c70] sm:text-lg",
  grid: "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6",
  card: "rounded-2xl border border-[#e8e0ed] bg-white p-5 shadow-sm sm:p-6",
  sectionTitle:
    "text-lg font-bold leading-snug tracking-tight text-[#211a2e] sm:text-xl",
  paragraph: "text-sm leading-relaxed text-[#514b5e] sm:text-base",
};

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <div
      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f2e7fa] text-[#7800c9]"
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3.5">
      <SectionIcon>{icon}</SectionIcon>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  );
}

function InfoCard({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`${styles.card} ${className}`}>
      {children}
    </section>
  );
}

export const Credits = () => {
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        {/* Encabezado */}
        <header className="mb-9 max-w-3xl sm:mb-11">
          <p className={styles.eyebrow}>Información legal</p>

          <h1 className={styles.heading}>
            Créditos del proyecto
          </h1>

          <p className={styles.description}>
            Información sobre el origen del contenido bíblico,
            los derechos de uso y el propósito de Mi Refugio.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#fff4d9] px-3.5 py-2 text-xs font-semibold text-[#805c17] sm:text-sm">
            <FileCheck2 aria-hidden="true" />
            <span>Proyecto sin fines de lucro · Licencia en trámite</span>
          </div>
        </header>

        <div className={styles.grid}>
          {/* Origen del texto bíblico */}
          <InfoCard id="texto" className="sm:col-span-2">
            <SectionHeader
              icon={<BookOpen />}
              title="Origen del texto bíblico"
            />

            <p className={styles.paragraph}>
              La aplicación incorpora contenido identificado como
              Reina-Valera 1960 (RVR1960), obtenido de archivos
              descargados de internet. Actualmente no contamos con
              documentación que permita verificar su procedencia
              oficial ni su autorización de uso.
            </p>
          </InfoCard>

          {/* Derechos y licencia */}
          <InfoCard>
            <SectionHeader
              icon={<FileCheck2 />}
              title="Derechos y licencia"
            />

            <span className="mb-4 inline-flex items-center rounded-full bg-[#fff4d9] px-3.5 py-1.5 text-sm font-semibold text-[#805c17]">
              En trámite
            </span>

            <p className={styles.paragraph}>
              Actualmente no contamos con una licencia de uso.
              Ya establecimos contacto con la Sociedad Bíblica
              Boliviana y estamos realizando las gestiones para
              solicitar la autorización correspondiente.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-[#716b7d]">
              La autorización todavía no ha sido concedida.
            </p>
          </InfoCard>

          {/* Propósito y desarrollo */}
          <InfoCard>
            <SectionHeader
              icon={<CheckCircle2 />}
              title="Propósito y desarrollo"
            />

            <p className={styles.paragraph}>
              Mi Refugio es un proyecto personal, gratuito y sin
              fines de lucro, desarrollado con el propósito de
              ofrecer herramientas digitales para consultar,
              compartir y conservar contenido bíblico.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-[#716b7d]">
              Desarrollado de manera independiente bajo el nombre
              Gutisoft, que actualmente no constituye una empresa
              legalmente establecida.
            </p>
          </InfoCard>

          {/* Contacto */}
          <InfoCard id="contacto" className="sm:col-span-2">
            <SectionHeader
              icon={<Mail />}
              title="Contacto"
            />

            <p className={`${styles.paragraph} mb-5`}>
              Para consultas, observaciones o comunicaciones
              relacionadas con los derechos del contenido,
              puedes escribirnos.
            </p>

            <Button
              type="button"
              onClick={() =>
                window.location.assign(
                  "mailto:gutisoft.dev@gmail.com"
                )
              }
              className="w-full sm:w-auto"
            >
              <Mail className="mr-2 h-4 w-4" />
              gutisoft.dev@gmail.com
            </Button>
          </InfoCard>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="mx-auto max-w-6xl border-t border-[#e8e0ed] px-5 py-7 sm:px-8">
        <div className="max-w-3xl">
          <strong className="text-base font-bold text-[#373044]">
            Mi Refugio
          </strong>

          <p className="mt-2 text-sm leading-relaxed text-[#716b7d]">
            Proyecto personal desarrollado por Gutisoft,
            con el propósito de ofrecer gratuitamente
            la aplicación.
          </p>

          <p className="mt-2 text-xs text-[#898394]">
            Versión de prueba · 2026
          </p>
        </div>
      </footer>
    </div>
  );
};
