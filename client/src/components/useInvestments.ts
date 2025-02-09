import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Investment, InvestmentType } from "./types";

import axiosInstance from "../axiosConfig";

type InvestmentsProps = {
  isLoading: boolean;
  isError: boolean;
  data: {
    investments: Investment[] | undefined;
    investmentTypes: InvestmentType[] | undefined;
  };
};

export function useInvestments(): InvestmentsProps {
  const results = useQueries({
    queries: [
      {
        queryKey: ["investments"],
        queryFn: async (): Promise<Investment[]> => {
          const { data } =
            await axiosInstance.get<Investment[]>("/api/investment");
          return data.map((investment) => ({
            ...investment,
            date: new Date(investment.date),
          }));
        },
      },
      {
        queryKey: ["investment-types"],
        queryFn: async (): Promise<InvestmentType[]> => {
          const { data } = await axiosInstance.get<InvestmentType[]>(
            "/api/investment-type"
          );
          return data;
        },
      },
    ],
  });

  const investmentsQuery = results[0];
  const investmentTypesQuery = results[1];

  return {
    isLoading: investmentsQuery.isLoading || investmentTypesQuery.isLoading,
    isError: investmentsQuery.isError || investmentTypesQuery.isError,
    data: {
      investments: investmentsQuery.data,
      investmentTypes: investmentTypesQuery.data,
    },
  };
}

export function useMutateInvestments() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/investment/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (newInvestment: Omit<Investment, "_id">) =>
      axiosInstance.post("/api/investment", newInvestment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  const deleteTypeMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/api/investment-type/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investment-types"] });
      await queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  return {
    createMutation,
    deleteMutation,
    deleteTypeMutation,
  };
}
