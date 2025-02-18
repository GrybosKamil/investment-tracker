import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { InvestmentType } from "./types";
import { useMutateInvestments } from "./useInvestments";

const Schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be at most 20 characters"),
});

export function NewInvestmentType() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<InvestmentType, "_id">>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "" },
    mode: "onBlur",
  });

  const { createTypeMutation } = useMutateInvestments();

  const onSubmit: SubmitHandler<Omit<InvestmentType, "_id">> = (
    data: Omit<InvestmentType, "_id">,
  ) => {
    createTypeMutation.mutate(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Investment Type Name:
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <InputText {...field} invalid={!!fieldState.error} />
              {fieldState.error ? (
                <span>{fieldState.error.message}</span>
              ) : null}
            </>
          )}
        />
      </label>
      <Button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        label="Add InvestmentType"
      />
    </form>
  );
}
