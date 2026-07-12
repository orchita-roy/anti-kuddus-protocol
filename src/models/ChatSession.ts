import { Schema, model, models } from "mongoose";
export const ASSISTANT_MODES=["school_rules","fact_check","study_assistant","safety_guidance","teacher_intelligence","democracy_guidance"] as const;
const schema=new Schema({userId:{type:Schema.Types.ObjectId,required:true,index:true},title:{type:String,required:true,maxlength:100},mode:{type:String,enum:ASSISTANT_MODES,required:true}},{timestamps:true,strict:"throw"});
schema.index({userId:1,updatedAt:-1});
export const ChatSession=models.ChatSession||model("ChatSession",schema);
