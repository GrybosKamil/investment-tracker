import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Investment, InvestmentType } from "./types";
import { useMutateInvestments } from "./useInvestments";

const newInvestmentSchema = z.object({
  type: z.string().nonempty("Investment type is required"),
  date: z.string().nonempty("Date is required"),
  value: z.number().positive("Value must be a positive number"),
});

export function NewInvestment({
  investmentTypes,
}: {
  investmentTypes: InvestmentType[];
}) {
  const { createMutation } = useMutateInvestments();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Investment, "_id">>({
    resolver: zodResolver(newInvestmentSchema),
    defaultValues: {
      type: "",
      date: new Date(),
      value: 0,
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<Omit<Investment, "_id">> = (
    data: Omit<Investment, "_id">,
  ) => {
    createMutation.mutate(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Investment Type</label>
        <select {...register("type")}>
          <option value="">Select type</option>
          {investmentTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.type && <p>{errors.type.message}</p>}
      </div>

      <div>
        <label>Date</label>
        <input type="date" {...register("date")} />
        {errors.date && <p>{errors.date.message}</p>}
      </div>

      <div>
        <label>Value</label>
        <input
          type="number"
          step="0.01"
          {...register("value", { valueAsNumber: true })}
        />
        {errors.value && <p>{errors.value.message}</p>}
      </div>

      <button type="submit" disabled={Object.keys(errors).length > 0}>
        Add Investment
      </button>
    </form>
  );
}
