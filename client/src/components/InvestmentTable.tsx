import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Panel } from "primereact/panel";
import { Investment, InvestmentType } from "./../types";

interface InvestmentTableProps {
  investmentList: Record<string, Investment>[];
  investmentTypes: InvestmentType[];
  visibleColumns: Record<string, boolean>;
  handleColumnVisibilityChange: (typeId: string) => void;
  handleInvestmentClick: (id: string) => void;
  handleConfirmDelete: (id: string) => void;
  handleCancelDelete: () => void;
  handleDeleteClick: (id: string) => void;
  selectedInvestmentId: string | null;
  confirmDeleteId: string | null;
}

export function InvestmentTable({
  investmentList,
  investmentTypes,
  visibleColumns,
  handleColumnVisibilityChange,
  handleInvestmentClick,
  handleConfirmDelete,
  handleCancelDelete,
  handleDeleteClick,
  selectedInvestmentId,
  confirmDeleteId,
}: InvestmentTableProps) {
  return (
    <>
      <div>
        {investmentTypes.map((type) => (
          <div key={type._id}>
            <Checkbox
              inputId={type._id}
              checked={visibleColumns[type._id] !== false}
              onChange={() => handleColumnVisibilityChange(type._id)}
            />
            <label htmlFor={type._id}>{type.name}</label>
          </div>
        ))}
      </div>
      <DataTable value={investmentList}>
        <Column field="date" header="Date" />

        <Column
          field="sum"
          header="Sum"
          body={(rowData: Record<string, Investment[]>) => {
            const sum = investmentTypes.reduce((acc, type) => {
              if (visibleColumns[type._id] !== false) {
                const investments = rowData[type._id] || [];
                const typeSum = investments.reduce(
                  (typeAcc, investment) => typeAcc + investment.value,
                  0
                );
                return acc + typeSum;
              }
              return acc;
            }, 0);
            return (
              <span style={{ textAlign: "right", display: "block" }}>
                {sum.toFixed(2)}
              </span>
            );
          }}
        />

        {investmentTypes.map(
          (type: InvestmentType) =>
            visibleColumns[type._id] !== false && (
              <Column
                key={type._id}
                field={type._id}
                header={type.name}
                body={(rowData: Record<string, Investment[]>) => (
                  <>
                    {rowData[type._id].map(({ _id, value }: Investment) => (
                      <div key={_id}>
                        <span
                          onClick={() => handleInvestmentClick(_id)}
                          style={{
                            marginLeft: "0.5rem",
                            cursor: "pointer",
                            textAlign: "right",
                            display: "block",
                          }}
                        >
                          {value.toFixed(2)}
                        </span>
                        {selectedInvestmentId === _id && (
                          <Panel header="Investment Actions">
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
                      </div>
                    ))}
                  </>
                )}
              />
            )
        )}
      </DataTable>
    </>
  );
}
