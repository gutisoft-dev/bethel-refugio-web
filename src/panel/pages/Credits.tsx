import { Button } from "@/components/ui/button";
import { BookOpen } from "@/icons/BookOpen";
import { Check } from "@/icons/Check";
import { CheckCircle2 } from "@/icons/CheckCircle2";
import { Close } from "@/icons/Close";
import { FileCheck2 } from "@/icons/FileCheck2";
import { LockKeyhole } from "@/icons/LockKeyhole";
import { Mail } from "@/icons/Mail";
import { XCircle } from "@/icons/XCircle";

const allowed = [
  "Buscar y leer versículos.",
  "Guardar versículos para tu estudio personal.",
  "Proyectar versículos durante los servicios de la congregación.",
  "Compartir un versículo suelto, siempre con su referencia y el aviso de derechos de autor.",
];

const restricted = [
  "Copiar o descargar la Biblia completa o capítulos en bloque.",
  "Publicar el texto fuera de la aplicación sin su referencia y aviso.",
  "Usar el texto con fines comerciales.",
  "Compartir tu acceso con personas no autorizadas.",
];



function SectionIcon({
  children,
  tone = "purple",
}: {
  children: React.ReactNode;
  tone?: "purple" | "red";
}) {
  return (
    <div
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-[11px] ${tone === "red" ? "bg-[#fdebea] text-[#bd3e37]" : "bg-[#f2e7fa] text-[#7800c9]"}`}
    >
      {children}
    </div>
  );
}

function InfoCard({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-[17px] border border-[#e4ddeb] bg-white p-[22px_23px] shadow-[0_1px_1px_rgba(39,17,64,0.02)] ${className}`}
    >
      {children}
    </section>
  );
}

export const Credits = () => {

  return (
    <div className="min-h-screen  text-[#171326]">
      <main
        className="mx-auto max-w-270 px-5.5 pb-12.5 pt-[38px] sm:px-[34px] sm:pb-[72px] sm:pt-[66px]"
      >
        <div className="mb-[30px] max-w-[790px]">
          <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[1.3px] text-[#7800c9]">
            Información legal
          </p>
          <h1 className="mb-[15px] text-3xl font-bold leading-[1.08] tracking-[-1.2px] ">
            Créditos y uso del texto bíblico
          </h1>
          <p className="mb-[22px] max-w-[730px] text-[18px] leading-[1.62] text-[#4e4a5d] sm:leading-[1.55]">
            Información sobre los derechos del texto bíblico, el estado de la
            licencia y las condiciones de uso de la aplicación.
          </p>
          <div className="inline-flex text-[12px] w-fit items-center gap-2 rounded-full bg-[#f2e7fa] px-[13px] py-2 text-sm font-semibold text-[#5a1196] sm:px-[10px] ">
            <LockKeyhole />
            <span>Prototipo cerrado · Licencia en trámite</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 sm:gap-[22px]">
          <InfoCard
            id="texto"
            className="sm:col-span-2 lg:grid lg:grid-cols-[1fr_1.2fr] lg:gap-x-[42px]"
          >
            <div className="mb-[17px] flex items-center gap-[14px] lg:col-span-full">
              <SectionIcon>
                <BookOpen />
              </SectionIcon>
              <h2 className="text-[21px] font-bold leading-[1.25] tracking-[-0.35px] sm:text-[22px]">
                Texto bíblico
              </h2>
            </div>
            <dl className="m-0 lg:col-start-1">
              <div className=" border-b border-[#e4ddeb] pb-[15px]">
                <dt className="mb-1 text-sm text-[#716b7d]">Versión</dt>
                <dd className=" leading-[1.4] ">Reina-Valera 1960 (RVR1960)</dd>
              </div>
              <div className="mb-[15px] border-b border-[#e4ddeb] pb-[15px]">
                <dt className="mb-1 text-sm text-[#716b7d]">
                  Titular de los derechos
                </dt>
                <dd className=" leading-[1.4] ">
                  Sociedades Bíblicas en América Latina, 1960
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-sm text-[#716b7d]">
                  Derechos renovados
                </dt>
                <dd className=" leading-[1.4]">
                  1988, Sociedades Bíblicas Unidas
                </dd>
              </div>
            </dl>
            <p className="my-[25px] rounded-xl border border-[#e7d9ee] bg-[#faf3fd] px-[19px] py-[17px]  leading-[1.7] text-[#4f4759] lg:col-start-2 lg:row-start-2 lg:my-0 lg:self-center">
              Texto bíblico Reina-Valera 1960® © Sociedades Bíblicas en América
              Latina, 1960. Derechos renovados 1988, Sociedades Bíblicas Unidas.
            </p>
            <p className="m-0 text-base leading-[1.65] text-[#6d6878] lg:col-start-2">
              Bethel Refugio no es propietaria del texto bíblico ni está
              afiliada a las Sociedades Bíblicas.
            </p>
          </InfoCard>

          <InfoCard>
            <div className="mb-[17px] flex items-center gap-[14px]">
              <SectionIcon>
                <FileCheck2 />
              </SectionIcon>
              <h2 className=" font-bold leading-[1.25] tracking-[-0.35px] ">
                Estado de la licencia
              </h2>
            </div>
            <span className="mb-[18px] inline-block rounded-full bg-[#fff4d9] px-[14px] py-[7px] text-sm font-bold text-[#805c17]">
              En trámite
            </span>
            <p className="m-0 text-[17px] leading-[1.7] text-[#393445]">
              Estamos gestionando la licencia de uso con la Sociedad Bíblica
              Boliviana. Mientras tanto, la aplicación funciona como prototipo
              cerrado, solo para personas autorizadas de la congregación
              Movimiento Misionero Mundial Tarija.
            </p>
          </InfoCard>

          <InfoCard id="uso">
            <div className="mb-[17px] flex items-center gap-[14px]">
              <SectionIcon>
                <CheckCircle2 />
              </SectionIcon>
              <h2 className=" font-bold leading-[1.25] tracking-[-0.35px] ">
                Qué puedes hacer
              </h2>
            </div>
            <ul className="m-0 grid list-none gap-[17px] p-0">
              {allowed.map((item) => (
                <li
                  className="grid grid-cols-[24px_1fr] gap-[15px]  leading-[1.55] text-[#393445]"
                  key={item}
                >
                  <Check  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </InfoCard>
          <InfoCard>
            <div className="mb-[17px] flex items-center gap-[14px]">
              <SectionIcon tone="red">
                <XCircle />
              </SectionIcon>
              <h2 className="font-bold leading-[1.25] tracking-[-0.35px] ">
                Qué no está permitido
              </h2>
            </div>
            <ul className="m-0 grid list-none gap-[17px] p-0">
              {restricted.map((item) => (
                <li
                  className="grid grid-cols-[24px_1fr] gap-[15px] text-[17px] leading-[1.55] text-[#393445]"
                  key={item}
                >
                  <Close className="text-[#bd3e37]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard id="contacto" className="sm:col-span-2">
            <div className="mb-[17px] flex items-center gap-[14px]">
              <SectionIcon>
                <Mail />
              </SectionIcon>
              <h2 className=" font-bold leading-[1.25] tracking-[-0.35px] sm:text-[22px]">
                Contacto
              </h2>
            </div>
            <p className="m-0  leading-[1.7] text-[#393445]">
              Si eres titular de derechos y tienes alguna observación sobre el
              uso del texto, escríbenos y la atenderemos de inmediato.
            </p>
            <Button>gutisoft.dev@gmail.com</Button>
          </InfoCard>
        </div>
      </main>
      <footer className="mx-auto max-w-[1035px] border-t border-[#e4ddeb] p-3 text-[15px] leading-[1.65] text-[#686274] ">
        <strong className="text-base text-[#373044]">Bethel Refugio</strong>
        <p className="m-0 mt-[7px] max-w-[580px]">
          Desarrollada por Gutisoft para la congregación Movimiento Misionero
          Mundial Tarija. Aplicación gratuita y sin publicidad.
        </p>
        <p className="m-0 mt-[3px]">Versión de prueba · 2026</p>
      </footer>
    </div>
  );
};
