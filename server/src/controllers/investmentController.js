import Investment from "../models/investmentModel.js";
import InvestmentType from "../models/investmentTypeModel.js";

export const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find().sort({ date: -1 });
    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInvestment = async (req, res) => {
  const { type, value, date } = req.body;
  const newInvestment = new Investment({ type, value, date });

  try {
    await newInvestment.save();
    res.status(201).json(newInvestment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listInvestmentTypes = async (req, res) => {
  try {
    const investmentTypes = await InvestmentType.find();
    res.status(200).json(investmentTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addInvestmentType = async (req, res) => {
  const { name } = req.body;

  const newInvestmentType = new InvestmentType({ name });

  try {
    const savedInvestmentType = await newInvestmentType.save();
    res.status(201).json(savedInvestmentType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInvestment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInvestment = await Investment.findByIdAndDelete(id);
    if (!deletedInvestment) {
      return res.status(404).json({ message: "Investment not found" });
    }
    res.status(200).json({ message: "Investment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInvestmentType = async (req, res) => {
  const { id } = req.params;

  try {
    const investments = await Investment.find({ type: id });
    if (investments.length > 0) {
      await Investment.deleteMany({ type: id });
    }
    const deletedInvestmentType = await InvestmentType.findByIdAndDelete(id);
    if (!deletedInvestmentType) {
      return res.status(404).json({ message: "Investment type not found" });
    }
    res.status(200).json({
      message: "Investment type and related investments deleted successfully",
      deletedCount: investments.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
