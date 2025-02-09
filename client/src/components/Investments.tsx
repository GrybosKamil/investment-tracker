import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../axiosConfig";
import { NewInvestment } from "./NewInvestment";
import { InvestmentType } from "./InvestmentTypes";
import { InvestmentChart } from "./InvestmentChartOther";

export type Investment = {
  _id: string;
  type: string;
  value: number;
  date: Date;
};

export function Investments() {
  const queryClient = useQueryClient();

  const [showList, setShowList] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data, error, isLoading } = useQuery<Investment[], Error>({
    queryKey: ["investments"],
    queryFn: async (): Promise<Investment[]> => {
      const { data } = await axiosInstance.get<Investment[]>("/api/investment");
      return data.map((investment) => ({
        ...investment,
        date: new Date(investment.date),
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/investment/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleConfirmDelete = (id: string) => {
    deleteMutation.mutate(id);
    setConfirmDeleteId(null);
  };

  const investmentTypes: InvestmentType[] =
    queryClient.getQueryData(["investment-types"]) || [];

  const getInvestmentTypeName = (typeId: string) => {
    const type = investmentTypes?.find(
      (type: InvestmentType) => type._id === typeId
    );
    return type ? type.name : "Unknown";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h2>Investments</h2>
      <NewInvestment />
      <InvestmentChart investments={data} investmentTypes={investmentTypes} />
      <button onClick={() => setShowList(!showList)}>
        {showList ? "Hide Investments" : "Show Investments"}
      </button>
      {showList && (
        <ul>
          {data.map(({ _id, type, value, date }: Investment) => (
            <li key={_id}>
              {getInvestmentTypeName(type)}: {value} on {date.toISOString()}
              {confirmDeleteId === _id ? (
                <>
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
      )}
    </div>
  );
}
