import { useEffect, useMemo, useState } from "react";
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
import { Investment, InvestmentType } from "./types";

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
    setSelectedTypes(investmentTypes);
  }, [investmentTypes]);

  const handleTypeChange = (type: InvestmentType) => {
    setSelectedTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(type)
        ? prevSelectedTypes.filter((el) => el !== type)
        : [...prevSelectedTypes, type],
    );
  };

  const chartData = useMemo(() => prepareChartData(investments), [investments]);

  return (
    <div>
      <div>
        <h5>Filter Investment Types</h5>
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
          data={chartData.sort((a, b) => {
            return a.date - b.date;
          })}
        >
          <CartesianGrid strokeDasharray="10 10" />

          <YAxis />

          <XAxis
            dataKey={(element: ChartDataElement) =>
              new Date(element.date).toISOString().slice(0, 10)
            }
            angle={-60}
            textAnchor="end"
            tickMargin={10}
            height={100}
          />

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
                dataKey={type._id}
                name={type.name}
                strokeWidth={2}
                stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index % 4]}
                activeDot={{ r: 9 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

type ChartDataElement = {
  date: number;
  [type: string]: number;
};

function prepareChartData(investments: Investment[]): ChartDataElement[] {
  const result: {
    [key: number]: ChartDataElement;
  } = {};

  investments.forEach((investment) => {
    const date = investment.date.getTime();
    if (!result[date]) {
      result[date] = {
        date,
        [investment.type]: investment.value,
      };
    } else {
      const previous = result[date];
      result[date] = { ...previous, [investment.type]: investment.value };
    }
  });

  return Object.values(result);
}
