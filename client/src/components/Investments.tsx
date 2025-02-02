import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import { NewInvestment } from "./NewInvestment";

export type Investment = {
  _id: number;
  type: string;
  value: number;
  date: string;
};

const fetchInvestments = async (): Promise<Investment[]> => {
  const { data } = await axiosInstance.get<Investment[]>("/api/investment");
  return data;
};

export function Investments() {
  const { data, error, isLoading } = useQuery<Investment[], Error>({
    queryKey: ["investments"],
    queryFn: fetchInvestments,
  });

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
          </li>
        ))}
      </ul>
    </div>
  );
}
