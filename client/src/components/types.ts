export type Investment = {
  _id: string;
  type: string;
  value: number;
  date: Date;
};

export type InvestmentType = {
  _id: string;
  name: string;
};
