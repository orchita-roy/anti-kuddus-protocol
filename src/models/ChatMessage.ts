import { Schema,model,models } from "mongoose";
const citation=new Schema({sourceType:{type:String,enum:["school_rule","curriculum","source_document","complaint_statistics","ledger_analytics","sos_summary","seat_plan","rumor_check","behaviour_analysis","democracy_proposal"]},sourceId:String,sourceTitle:String,section:String,pageNumber:Number},{_id:false});
const schema=new Schema({sessionId:{type:Schema.Types.ObjectId,required:true,index:true},role:{type:String,enum:["user","assistant"],required:true},content:{type:String,required:true,maxlength:20000},groundingStatus:{type:String,enum:["grounded","partially_grounded","insufficient_context"],required:true},citations:[citation]},{timestamps:{createdAt:true,updatedAt:false},strict:"throw"});
schema.index({sessionId:1,createdAt:1});
export const ChatMessage=models.ChatMessage||model("ChatMessage",schema);
