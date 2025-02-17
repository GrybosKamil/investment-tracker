import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { SubmitHandler, useForm } from "react-hook-form";
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
    register,
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
        <input {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </label>
      <Button type="submit" disabled={Object.keys(errors).length > 0} label="Add InvestmentType" />
    </form>
  );
}
