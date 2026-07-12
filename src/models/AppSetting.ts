import { Schema, model, models } from "mongoose";
const schema = new Schema({ key: { type: String, unique: true }, value: Schema.Types.Mixed, updatedBy: Schema.Types.ObjectId }, { timestamps: true });
export const AppSetting = models.AppSetting || model("AppSetting", schema);
