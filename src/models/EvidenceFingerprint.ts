import { Schema,model,models } from "mongoose";
const schema=new Schema({sha256:{type:String,unique:true,required:true},perceptualHash:{type:String,required:true,index:true},width:Number,height:Number,format:String,firstSeenAt:{type:Date,default:Date.now},submissionCount:{type:Number,default:1},isDemo:{type:Boolean,default:false,index:true}},{timestamps:true,strict:"throw"});
export const EvidenceFingerprint=models.EvidenceFingerprint||model("EvidenceFingerprint",schema);
