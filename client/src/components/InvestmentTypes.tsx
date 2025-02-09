import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { NewInvestmentType } from "./NewInvestmentType";
import { Investment, InvestmentType } from "./types";
import { useMutateInvestments } from "./useInvestments";

export function InvestmentTypes({
  investmentTypes,
}: {
  investmentTypes: InvestmentType[];
}) {
  const queryClient = useQueryClient();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [relatedInvestmentsCount, setRelatedInvestmentsCount] =
    useState<number>(0);

  const { deleteTypeMutation } = useMutateInvestments();

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
    deleteTypeMutation.mutate(id);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <h2>Investment Types</h2>
      <NewInvestmentType />
      <ul>
        {investmentTypes.map(({ _id, name }: InvestmentType) => (
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
