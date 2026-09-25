
import { Check } from "@/icons/Check";
import {  useState,  } from "react";
import { FormEmail } from "../components/FormEmail";
import { ContentOtp } from "../components/ContentOtp";

export const Login = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  const handleEmail = (email: string) => setEmail(email);
  const handleStep = () => setStep("otp");
  const handleResetFlow = () => setStep("email");

  return (
    <section className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/90 bg-white/90  backdrop-blur-xl">
      <div className="flex flex-col px-6 py-9 sm:px-12 sm:py-12">
        <div className="mb-9 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-tight">
            <span className="grid size-10 place-items-center rounded-xl bg-[#7209b7] text-white shadow-lg">
              {/* <BookOpen aria-hidden="true" /> */}
            </span>
            Bethel
          </div>
        </div>
        <div className="mb-5 rounded-2xl bg-[#faf6fd] px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7209b7]">
            Comunidad bíblica
          </div>
          <p className="mt-2 text-sm leading-5 text-[#75657d]">
            Lee, guarda y comparte la Palabra que inspira tu camino.
          </p>
        </div>
        <div className="mb-10 flex items-center justify-between lg:hidden">
          <span className="text-xs font-medium text-[#907d9e]">
            Comunidad bíblica
          </span>
        </div>
        <>
          <div
            className="mb-8 flex items-center gap-3"
            aria-label={`Paso ${step === "email" ? "1" : "2"} de 2`}
          >
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-[#7209b7] text-xs font-bold text-white">
                {step === "email" ? "1" : <Check aria-hidden="true" />}
              </span>
              <span className="text-xs font-semibold text-[#7209b7]">
                Tu email
              </span>
            </div>
            <div className="h-px w-10 bg-[#e6d9ed] sm:w-16" />
            <div className="flex items-center gap-2">
              <span
                className={`grid size-7 place-items-center rounded-full text-xs font-bold ${step === "otp" ? "bg-[#7209b7] text-white" : "bg-[#f3edf6] text-[#a795b0]"}`}
              >
                2
              </span>
              <span
                className={`text-xs font-semibold ${step === "otp" ? "text-[#7209b7]" : "text-[#a795b0]"}`}
              >
                Código
              </span>
            </div>
          </div>

          {step === "email" ? (
            <FormEmail handleEmail={handleEmail} handleStep={handleStep} />
          ) : (
            <ContentOtp handleresetFlow={handleResetFlow} email={email} />
          )}
        </>
      </div>
    </section>
  );
};
