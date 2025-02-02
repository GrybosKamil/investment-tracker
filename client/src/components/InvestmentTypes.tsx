import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosConfig";
import { NewInvestmentType } from "./NewInvestmentType";

export type InvestmentType = {
  _id: number;
  name: string;
};

const fetchInvestmentTypes = async (): Promise<InvestmentType[]> => {
  const { data } = await axiosInstance.get<InvestmentType[]>(
    "/api/investment-type",
  );
  return data;
};

export function InvestmentTypes() {
  const { data, error, isLoading } = useQuery<InvestmentType[], Error>({
    queryKey: ["investment-types"],
    queryFn: fetchInvestmentTypes,
  });

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
          <li key={_id}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
