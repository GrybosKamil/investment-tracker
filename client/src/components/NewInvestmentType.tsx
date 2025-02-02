import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { InvestmentType } from "./InvestmentTypes";

type NewInvestmentType = Omit<InvestmentType, "_id">;

export function NewInvestmentType() {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newInvestmentType: NewInvestmentType) => {
      return axiosInstance.post("/api/investment-type", newInvestmentType);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: "investment-types" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Investment Type Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button type="submit">Add InvestmentType</button>
    </form>
  );
}
