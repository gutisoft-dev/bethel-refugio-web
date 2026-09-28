import { Check } from "@/icons/Check";
import type { StepAuth } from "../interface/step";

interface Prop {
  step: StepAuth;
}

export const StepContent = ({ step }: Prop) => {
  return (
    <div
      className="mb-8 flex items-center gap-3"
      aria-label={`Paso ${step === "email" ? "1" : "2"} de 2`}
    >
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-[#7209b7] text-xs font-bold text-white">
          {step === "email" ? "1" : <Check aria-hidden="true" />}
        </span>
        <span className="text-xs font-semibold text-[#7209b7]">Tu email</span>
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
  );
};
