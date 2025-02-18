import { Button } from "primereact/button";
import { useState } from "react";
import { ExportInvestments } from "./ExportInvestments";
import { ImportInvestments } from "./ImportInvestments";
import { InvestmentChart } from "./InvestmentChart";
import { InvestmentTypes } from "./InvestmentTypes";
import { NewInvestment } from "./NewInvestment";
import { Investment, InvestmentType } from "./types";
import { useInvestments, useMutateInvestments } from "./useInvestments";

export function Investments() {
  const [showList, setShowList] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { deleteMutation } = useMutateInvestments();

  const { isLoading, isError, data } = useInvestments();

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

  function getInvestmentTypeName(
    investmentTypes: InvestmentType[],
    typeId: string,
  ): string {
    const type = investmentTypes?.find(
      (type: InvestmentType) => type._id === typeId,
    );
    return type ? type.name : "Unknown";
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data.investments || !data.investmentTypes) {
    return <div>Error</div>;
  }

  const investments: Investment[] = data.investments;
  const investmentTypes: InvestmentType[] = data.investmentTypes;

  const groupedInvestments = investments.reduce((acc, investment) => {
    const date = investment.date.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(investment);
    return acc;
  }, {} as Record<string, Investment[]>);

  return (
    <div>
      <InvestmentChart
        investments={investments}
        investmentTypes={investmentTypes}
      />

      <InvestmentTypes investmentTypes={investmentTypes} />

      <h2>Investments</h2>
      <NewInvestment investmentTypes={investmentTypes} />

      <h2>Import Investments</h2>
      <ImportInvestments />

      <h2>Export Investments</h2>
      <ExportInvestments />

      <h2>Investment List</h2>
      {showList ? (
        <Button onClick={() => setShowList(false)} label="Hide Investments" />
      ) : (
        <Button onClick={() => setShowList(true)} label="Show Investments" />
      )}

      {showList && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Investments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedInvestments).map(([date, investments]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>
                  <ul>
                    {investments.map(({ _id, type, value }) => (
                      <li key={_id}>
                        {`${getInvestmentTypeName(investmentTypes, type)}: ${value}`}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  {investments.map(({ _id }) => (
                    <div key={_id}>
                      {confirmDeleteId === _id ? (
                        <>
                          <Button
                            onClick={() => handleConfirmDelete(_id)}
                            label="Confirm"
                            severity="danger"
                          />
                          <Button
                            onClick={handleCancelDelete}
                            label="Cancel"
                            severity="secondary"
                          />
                        </>
                      ) : (
                        <Button
                          onClick={() => handleDeleteClick(_id)}
                          label="Delete"
                          severity="danger"
                        />
                      )}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}