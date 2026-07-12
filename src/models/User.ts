import { Schema, model, models } from "mongoose";
const schema = new Schema({ name: { type: String, required: true }, rollLookupHash: { type: String, required: true, unique: true, index: true }, encryptedRollNumber: String, secretHash: { type: String, required: true }, role: { type: String, enum: ["student", "captain", "teacher", "admin"], index: true }, captainRank: { type: Number, enum: [2,3] }, active: { type: Boolean, default: true, index: true } }, { timestamps: true });
export const User = models.User || model("User", schema);
