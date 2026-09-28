import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Left } from "@/icons/Left";
import { Controller, useForm } from "react-hook-form";
import { useAuthStore } from "../store/auth.store";
import { ButtonSubmit } from "./ButtonSubmit";

interface FormData {
  otp: string;
}

interface Props {
  handleresetFlow: () => void;
  email: string;
}

export const ContentOtp = ({ handleresetFlow, email }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { loginOtp } = useAuthStore();
 const [isPosting, setIsPosting] = useState(false);
  const onSubmit = async (data: FormData) => {
    setIsPosting(true);
   await  loginOtp(email, data.otp);
    setIsPosting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
      <div>
        <button
          type="button"
          onClick={handleresetFlow}
          className="mb-7 cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-[#8b7896] transition hover:text-[#7209b7]"
        >
          <Left aria-hidden="true" />
          Cambiar email
        </button>
        <p className="mb-3 text-sm font-medium text-[#8b7896]">
          Un último paso
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#241333]">
          Confirma tu email
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#75657d]">
          Enviamos un código de 6 dígitos a
          <span className="font-semibold text-[#7209b7]">{email}</span>.
        </p>
      </div>
      <div
        className="space-y-4 mb-6 flex flex-col items-center mt-3 "
        aria-label="Código de verificación"
      >
        <Controller
          name="otp"
          control={control}
          rules={{
            required: "El código es obligatorio",
            minLength: {
              value: 6,
              message: "El código debe tener 6 dígitos",
            },
          }}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
                </InputOTPGroup>
              </InputOTPGroup>
            </InputOTP>
          )}
        />
      </div>
      {errors.otp && (
        <p className="-mt-3 text-sm text-red-600" role="alert">
          {errors.otp.message}
        </p>
      )}
      <ButtonSubmit isPosting={isPosting} text="Continuar" />
    </form>
  );
};
