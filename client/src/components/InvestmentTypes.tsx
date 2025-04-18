import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { useState } from "react";
import { NewInvestmentType } from "./NewInvestmentType";
import { Investment, InvestmentType } from "./../types";
import { useMutateInvestments } from "./useInvestments";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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

  const actionBodyTemplate = (rowData: InvestmentType) => {
    return confirmDeleteId === rowData._id ? (
      <>
        <span>({relatedInvestmentsCount} investments will be deleted)</span>
        <Button
          label="Confirm"
          onClick={() => handleConfirmDelete(rowData._id)}
          severity="danger"
        />
        <Button
          label="Cancel"
          onClick={handleCancelDelete}
          severity="secondary"
        />
      </>
    ) : (
      <Button
        label="Delete"
        onClick={() => handleDeleteClick(rowData._id)}
        severity="danger"
      />
    );
  };

  return (
    <div>
      <h2>Investment Types</h2>
      <NewInvestmentType />
      <DataTable value={investmentTypes}>
        <Column field="name" header="Name" />
        <Column body={actionBodyTemplate} header="Actions" />
      </DataTable>
    </div>
  );
}
