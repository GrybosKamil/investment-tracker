import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Investment } from "./Investments";
import { InvestmentType } from "./InvestmentTypes";

export function InvestmentChart({
  investments,
  investmentTypes,
}: {
  investments: Investment[];
  investmentTypes: InvestmentType[];
}) {
  const [selectedTypes, setSelectedTypes] =
    useState<InvestmentType[]>(investmentTypes);

  useEffect(() => {
    console.log({ investmentTypes });
    setSelectedTypes(investmentTypes);
  }, [investmentTypes]);

  const handleTypeChange = (type: InvestmentType) => {
    setSelectedTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(type)
        ? prevSelectedTypes.filter((el) => el !== type)
        : [...prevSelectedTypes, type]
    );
  };

  return (
    <div>
      <div>
        <h3>Filter Investment Types</h3>
        {investmentTypes.map((type) => (
          <label key={type._id}>
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => handleTypeChange(type)}
            />
            {type.name}
          </label>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={investments.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )}
        >
          <CartesianGrid strokeDasharray="10 10" />
          <XAxis dataKey="date" />
          <YAxis dataKey="value" />

          <Tooltip
            labelFormatter={(label) => {
              return <span style={{ color: "black" }}>{label}</span>;
            }}
          />

          <Legend />

          {investmentTypes
            .filter((type) => selectedTypes.includes(type))
            .map((type, index) => (
              <Line
                key={type._id}
                type="monotone"
                dataKey="value"
                data={investments.filter(
                  (investment) => investment.type === type._id
                )}
                name={type.name}
                stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index]}
                activeDot={{ r: 8 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
