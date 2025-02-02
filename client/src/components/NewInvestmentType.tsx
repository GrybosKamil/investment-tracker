import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "../axiosConfig";
import { InvestmentType } from "./InvestmentTypes";

type NewType = Omit<InvestmentType, "_id">;

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
  } = useForm<NewType>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    resolver: zodResolver(Schema),
    defaultValues: { name: "" },
    mode: "onBlur",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newInvestmentType: NewType) =>
      axiosInstance.post("/api/investment-type", newInvestmentType),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investment-types"] });
      reset();
    },
  });

  const onSubmit: SubmitHandler<NewType> = (data) => {
    mutation.mutate(data);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Investment Type Name:
        <input {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </label>
      <button type="submit">Add InvestmentType</button>
    </form>
  );
}
