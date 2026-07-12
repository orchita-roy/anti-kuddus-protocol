import { Schema, model, models } from "mongoose";
const schema = new Schema({ ruleId: { type: String, unique: true }, title: String, section: String, exactText: String, sourceDocumentId: Schema.Types.ObjectId, sourcePage: Number, embedding: [Number], active: { type: Boolean, default: true } }, { timestamps: true });
export const SchoolRule = models.SchoolRule || model("SchoolRule", schema);
