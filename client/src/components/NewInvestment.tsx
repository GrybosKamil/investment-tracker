import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Investment, InvestmentType } from "./types";
import { useMutateInvestments } from "./useInvestments";

const newInvestmentSchema = z.object({
  type: z.string().nonempty("Investment type is required"),
  date: z.date(),
  value: z.number().positive("Value must be a positive number"),
});

export function NewInvestment({
  investmentTypes,
}: {
  investmentTypes: InvestmentType[];
}) {
  const { createMutation } = useMutateInvestments();

  const {
    control,
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
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Dropdown
                {...field}
                placeholder="Select type"
                options={investmentTypes.map((type) => ({
                  label: type.name,
                  value: type._id,
                }))}
                onChange={(e) => field.onChange(e.value)}
                invalid={!!fieldState.error}
              />
              {fieldState.error ? (
                <span>{fieldState.error.message}</span>
              ) : null}
            </>
          )}
        />
      </div>

      <div>
        <label>Date</label>
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Calendar
                {...field}
                onChange={(e) => field.onChange(e.value)}
                showIcon
                invalid={!!fieldState.error}
              />
              {fieldState.error ? (
                <span>{fieldState.error.message}</span>
              ) : null}
            </>
          )}
        />
      </div>

      <div>
        <label>Value</label>
        <Controller
          name="value"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <InputNumber
                {...field}
                onChange={(e) => field.onChange(e.value ? e.value : 0)}
                mode="decimal"
                min={0}
                max={undefined}
                minFractionDigits={2}
                maxFractionDigits={2}
                invalid={!!fieldState.error}
              />
              {fieldState.error ? (
                <span>{fieldState.error.message}</span>
              ) : null}
            </>
          )}
        />
      </div>

      <Button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        label="Add Investment"
      />
    </form>
  );
}
