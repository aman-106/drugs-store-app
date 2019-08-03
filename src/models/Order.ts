import mongoose from "mongoose";
import { ObjectId } from "bson";



type drugRef = {
  id: ObjectId,
  qantity: Number
}
export type orderDocument = mongoose.Document & {
  date: Date,
  drugs: [drugRef],
};

const orderSchema = new mongoose.Schema({
  date: Date,
  drugs: [{
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Drug" },
    qantity: { type: Number, default: 0 },
  }]
});


export const Order = mongoose.model<orderDocument>("Order", orderSchema);
