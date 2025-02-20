import { Investment, InvestmentType } from "./../types";
import { Investments } from "./Investments";
import { useInvestments } from "./useInvestments";

export function InvestmentsContext() {
  const { isLoading, isError, data } = useInvestments();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data.investments || !data.investmentTypes) {
    return <div>Error</div>;
  }

  const investments: Investment[] = data.investments;
  const investmentTypes: InvestmentType[] = data.investmentTypes;

  return (
    <Investments investments={investments} investmentTypes={investmentTypes} />
  );
}
