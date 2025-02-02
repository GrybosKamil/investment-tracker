import Investment from "../models/investmentModel.js";

export const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find();
    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInvestment = async (req, res) => {
  const { name, value, date } = req.body;
  const newInvestment = new Investment({ name, value, date });

  try {
    await newInvestment.save();
    res.status(201).json(newInvestment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
