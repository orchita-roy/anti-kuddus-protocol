import { Schema, model, models } from "mongoose";
const assignment = new Schema({ studentId: Schema.Types.ObjectId, name: String, heightCm: Number, isKuddus: Boolean, row: Number, column: Number }, { _id: false });
const schema = new Schema({ name: String, rows: Number, columns: Number, teacherPosition: { row: Number, column: Number }, aisleColumns: [Number], blockedSeats: [{ row: Number, column: Number }], assignments: [assignment], visibilityStatus: String, score: Number, explanation: [String], createdBy: Schema.Types.ObjectId }, { timestamps: true });
export const SeatPlan = models.SeatPlan || model("SeatPlan", schema);
