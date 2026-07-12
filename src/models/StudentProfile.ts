import { Schema, model, models } from "mongoose";
const schema = new Schema({ name: String, rollNumber: { type: String, unique: true }, heightCm: Number, visionImpairment: Boolean, hearingImpairment: Boolean, accessibilityRequirement: String, fixedSeat: { row: Number, column: Number }, isKuddus: { type: Boolean, default: false } }, { timestamps: true });
export const StudentProfile = models.StudentProfile || model("StudentProfile", schema);
