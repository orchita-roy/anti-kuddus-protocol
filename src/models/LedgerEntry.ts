import { Schema, model, models } from "mongoose";
const schema = new Schema({ type: { type: String, enum: ["washroom_payment","forced_payment","stolen_food"] }, amount: Number, foodId: Schema.Types.ObjectId, quantity: Number, date: Date, note: String }, { timestamps: true, strict: "throw" });
export const LedgerEntry = models.LedgerEntry || model("LedgerEntry", schema);
