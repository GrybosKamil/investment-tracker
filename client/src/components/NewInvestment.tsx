import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "../axiosConfig";
import { Investment } from "./Investments";
import { InvestmentType } from "./InvestmentTypes";

type NewInvestment = Omit<Investment, "_id">;

const newInvestmentSchema = z.object({
  type: z.string().nonempty("Investment type is required"),
  date: z.string().nonempty("Date is required"),
  value: z.number().positive("Value must be a positive number"),
});

export function NewInvestment() {
  const queryClient = useQueryClient();

  const { data: investmentTypes } = useQuery<InvestmentType[]>({
    queryKey: ["investment-types"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<InvestmentType[]>(
        "/api/investment-type",
      );
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newInvestment: NewInvestment) =>
      axiosInstance.post("/api/investment", newInvestment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewInvestment>({
    resolver: zodResolver(newInvestmentSchema),
    mode: "onBlur",
    defaultValues: {
      type: "",
      date: new Date().toISOString().split("T")[0],
      value: 0,
    },
  });

  const onSubmit = (data: NewInvestment) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Investment Type</label>
        <select {...register("type")}>
          <option value="">Select type</option>
          {investmentTypes?.map((type) => (
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
        <input type="number" {...register("value", { valueAsNumber: true })} />
        {errors.value && <p>{errors.value.message}</p>}
      </div>
      <button type="submit" disabled={Object.keys(errors).length > 0}>
        Add Investment
      </button>
    </form>
  );
}
