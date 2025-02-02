import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { Investment } from "./Investments";
import { InvestmentType } from "./InvestmentTypes";

type NewInvestment = Omit<Investment, "_id">;

export function NewInvestment() {
  const [investmentType, setInvestmentType] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [value, setValue] = useState<number | "">("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ type: investmentType, date, value: Number(value) });
    setInvestmentType("");
    setDate(new Date().toISOString().split("T")[0]);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Investment Type:
        <select
          value={investmentType}
          onChange={(e) => setInvestmentType(e.target.value)}
        >
          <option value="">Select Investment Type</option>
          {investmentTypes?.map((type) => (
            <option key={type._id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label>
        Value:
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <button type="submit">Add Investment</button>
    </form>
  );
}
