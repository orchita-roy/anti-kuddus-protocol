import { Schema, model, models } from "mongoose";
const schema = new Schema({ name: String, unit: String, estimatedCaloriesPerUnit: Number, active: { type: Boolean, default: true } }, { timestamps: true });
export const FoodItem = models.FoodItem || model("FoodItem", schema);
