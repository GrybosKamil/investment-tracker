import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../axiosConfig";
import { NewInvestment } from "./NewInvestment";

export type Investment = {
  _id: string;
  type: string;
  value: number;
  date: string;
};

const fetchInvestments = async (): Promise<Investment[]> => {
  const { data } = await axiosInstance.get<Investment[]>("/api/investment");
  return data;
};

export function Investments() {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery<Investment[], Error>({
    queryKey: ["investments"],
    queryFn: fetchInvestments,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/investment/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investments"] });
    },
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
      <ul>
        {data.map(({ _id, type, value, date }: Investment) => (
          <li key={_id}>
            {type}: {value} on {date}
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
    </div>
  );
}
