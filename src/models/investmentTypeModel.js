import mongoose from "mongoose";

const investmentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const InvestmentType = mongoose.model("InvestmentType", investmentTypeSchema);

export default InvestmentType;
