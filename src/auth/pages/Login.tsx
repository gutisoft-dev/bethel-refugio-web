import { useState } from "react";
import { FormEmail } from "../components/FormEmail";
import { ContentOtp } from "../components/ContentOtp";
import type { StepAuth } from "../interface/step";
import { StepContent } from "../components/StepContent";
import { useNavigate } from "react-router-dom";
import { Left } from "@/icons/Left";

export const Login = () => {
   const navigate = useNavigate();
  const [step, setStep] = useState<StepAuth>("email");
  const [email, setEmail] = useState("");

  const handleEmail = (email: string) => setEmail(email);
  const handleStep = () => setStep("otp");
  const handleResetFlow = () => setStep("email");

  return (
    <section className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/90 bg-white/90  backdrop-blur-xl">
      <div className="flex flex-col px-6 py-9 sm:px-12 sm:py-12">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center w-30 mb-5 gap-2 rounded-lg cursor-pointer text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          <span><Left/> </span>
          Volver atrás
        </button>
        <div className="mb-9 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-tight">
            <img
              src="/favicon-light.ico"
              alt="Bethel Refugio"
              className="h-6 w-6"
            />
            Bethel refugio
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
          <StepContent step={step} />

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
