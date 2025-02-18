import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
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
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null); // State for selected investment

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
    setSelectedInvestmentId(null); 
  };

  const handleInvestmentClick = (id: string) => {
    if (selectedInvestmentId !== id) {
      setSelectedInvestmentId(id);
    } else {
      setSelectedInvestmentId(null); 
    }
  };

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
      acc[date] = {};
    }
    if (!acc[date][investment.type]) {
      acc[date][investment.type] = [];
    }
    acc[date][investment.type].push(investment);
    return acc;
  }, {} as Record<string, Record<string, Investment[]>>);

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
              {investmentTypes.map((type) => (
                <th key={type._id}>{type.name}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Object.entries(groupedInvestments).map(([date, investmentsByType]) => (
              <tr key={date}>
                <td>{date}</td>
                {investmentTypes.map((type) => (
                  <td key={type._id}>
                    <>
                      {(investmentsByType[type._id] || []).map(({ _id, value }) => (
                        <>
                          <span
                            onClick={() => handleInvestmentClick(_id)}
                            style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                          >
                            {value}
                          </span>
                          {selectedInvestmentId === _id && (
                            <Panel header="Investment Details">
                              <div>
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
                            </Panel>
                          )}
                        </>
                      ))}
                    </>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}