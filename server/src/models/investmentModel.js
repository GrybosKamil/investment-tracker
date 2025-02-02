import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InvestmentType",
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Investment = mongoose.model("Investment", investmentSchema);

export default Investment;
