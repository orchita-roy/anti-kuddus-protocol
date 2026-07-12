import { Schema,model,models } from "mongoose";
export const ACTION_STATUSES=["not_started","in_progress","completed","verified"] as const;
const schema=new Schema({proposalId:Schema.Types.ObjectId,pollId:Schema.Types.ObjectId,title:{type:String,required:true},responsibleRole:{type:String,enum:["captain","teacher","admin"]},responsibleUserId:Schema.Types.ObjectId,deadline:Date,status:{type:String,enum:ACTION_STATUSES,default:"not_started",index:true},progressNote:String,completionEvidenceFileId:Schema.Types.ObjectId,verifiedBy:Schema.Types.ObjectId,verifiedAt:Date,isDemo:{type:Boolean,default:false,index:true}},{timestamps:true,strict:"throw"});
export const DecisionAction=models.DecisionAction||model("DecisionAction",schema);
