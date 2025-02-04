import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../axiosConfig";
import { Investment } from "./Investments";
import { NewInvestmentType } from "./NewInvestmentType";

export type InvestmentType = {
  _id: string;
  name: string;
};

export function InvestmentTypes() {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery<InvestmentType[], Error>({
    queryKey: ["investment-types"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<InvestmentType[]>(
        "/api/investment-type",
      );
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/api/investment-type/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investmentTypes"] });
      await queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [relatedInvestmentsCount, setRelatedInvestmentsCount] =
    useState<number>(0);

  const handleDeleteClick = (id: string) => {
    const investments = queryClient.getQueryData<Investment[]>(["investments"]);
    if (investments) {
      const count = investments.filter(
        (investment: Investment) => investment.type === id,
      ).length;
      setRelatedInvestmentsCount(count);
    }
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = (id: string) => {
    deleteMutation.mutate(id);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h2>Investment Types</h2>
      <NewInvestmentType />
      <ul>
        {data.map(({ _id, name }: InvestmentType) => (
          <li key={_id}>
            {name}
            {confirmDeleteId === _id ? (
              <>
                <span>
                  ({relatedInvestmentsCount} investments will be deleted)
                </span>
                <button onClick={() => handleConfirmDelete(_id)}>
                  Confirm
                </button>
                <button onClick={handleCancelDelete}>Cancel</button>
              </>
            ) : (
              <button onClick={() => handleDeleteClick(_id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
