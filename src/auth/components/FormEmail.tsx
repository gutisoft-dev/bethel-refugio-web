import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/auth.store";
import { toast } from "@/components/ui/toast";
import { useState } from "react";
import { ButtonSubmit } from "./ButtonSubmit";

interface FormData {
  email: string;
}
interface Props {
  handleEmail: (email: string) => void;
  handleStep: () => void;
}
export const FormEmail = ({ handleEmail, handleStep }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { login } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsPosting(true);
    handleEmail(data.email);
    const resp = await login(data.email);
    if (!resp) {
      setIsPosting(false);
      toast.add({
        type: "error",
        description: "Error al iniciar sesion",
        priority: "high",
      });
      return;
    }

    setIsPosting(false);
    handleStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
      <div>
        <p className="mb-3 text-sm font-medium text-[#8b7896]">
          Bienvenido a Versa
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#241333]">
          Entra a tu comunidad
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-[#75657d]">
          Ingresa tu email y te enviaremos un código para comenzar a compartir
          la Palabra.
        </p>
      </div>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-card-name-43j">Email</FieldLabel>
        <Input
          placeholder="Ingrese su email"
          className="h-10"
          required
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingrese un email válido",
            },
          })}
        />
      </Field>
      {errors.email && (
        <p className="-mt-4 text-sm text-red-600" role="alert">
          {errors.email.message}
        </p>
      )}
      <ButtonSubmit isPosting={isPosting} text="Enviar codigo" />
    </form>
  );
};
