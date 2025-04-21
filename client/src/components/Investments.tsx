import { Button } from "primereact/button";
import { useMemo, useState } from "react";
import { Investment, InvestmentType } from "./../types";
import { ExportInvestments } from "./ExportInvestments";
import { ImportInvestments } from "./ImportInvestments";
import { InvestmentChart } from "./InvestmentChart";
import { InvestmentTable } from "./InvestmentTable";
import { InvestmentTypes } from "./InvestmentTypes";
import { NewInvestment } from "./NewInvestment";
import { useMutateInvestments } from "./useInvestments";

type Props = {
  investments: Investment[];
  investmentTypes: InvestmentType[];
};

export function Investments({ investments, investmentTypes }: Props) {
  const [showList, setShowList] = useState<boolean>(false);
  const [showTypes, setShowTypes] = useState<boolean>(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<
    string | null
  >(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {},
  );

  const { deleteMutation } = useMutateInvestments();

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

  const handleColumnVisibilityChange = (typeId: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [typeId]: !prev[typeId],
    }));
  };

  const groupedInvestments = useMemo(() => {
    return investments.reduce(
      (acc, investment) => {
        const date = investment.date.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = {};
        }
        if (!acc[date][investment.type]) {
          acc[date][investment.type] = [];
        }
        acc[date][investment.type].push(investment);
        return acc;
      },
      {} as Record<string, Record<string, Investment[]>>,
    );
  }, [investments]);

  const investmentList = useMemo(() => {
    return Object.entries(groupedInvestments).map(
      ([date, investmentsByType]) => ({
        date,
        ...investmentTypes.reduce(
          (acc, type) => {
            acc[type._id] = investmentsByType[type._id] || [];
            return acc;
          },
          {} as Record<string, Investment[]>,
        ),
      }),
    );
  }, [groupedInvestments, investmentTypes]);

  return (
    <div>
      <InvestmentChart
        investments={investments}
        investmentTypes={investmentTypes}
      />

      {showTypes ? (
        <Button onClick={() => setShowTypes(false)} label="Hide Types" />
      ) : (
        <Button onClick={() => setShowTypes(true)} label="Show Types" />
      )}
      {showTypes ? (
        <InvestmentTypes investmentTypes={investmentTypes} />
      ) : (
        <></>
      )}

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

      {showList ? (
        <InvestmentTable
          investmentList={investmentList}
          investmentTypes={investmentTypes}
          visibleColumns={visibleColumns}
          handleColumnVisibilityChange={handleColumnVisibilityChange}
          handleInvestmentClick={handleInvestmentClick}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
          handleDeleteClick={handleDeleteClick}
          selectedInvestmentId={selectedInvestmentId}
          confirmDeleteId={confirmDeleteId}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
