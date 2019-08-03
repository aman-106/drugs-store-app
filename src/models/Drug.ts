import mongoose from "mongoose";

export type DrugDocument = mongoose.Document & {
  name: String,
  quantity: Number,
  sellingPrice: Number,
  costPrice: Number,
};

const drugSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  sellingPrice: Number,
  costPrice: Number,
});

export const Drug = mongoose.model<DrugDocument>("Drug", drugSchema);