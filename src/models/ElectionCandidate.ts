import { Schema,model,models } from "mongoose";
const schema=new Schema({pollId:{type:Schema.Types.ObjectId,required:true,index:true},publicId:{type:String,unique:true,required:true},displayName:{type:String,required:true},manifesto:{type:String,required:true},status:{type:String,enum:["nominated","approved","withdrawn"],default:"nominated"},createdBy:Schema.Types.ObjectId,isDemo:{type:Boolean,default:false,index:true}},{timestamps:true,strict:"throw"});
export const ElectionCandidate=models.ElectionCandidate||model("ElectionCandidate",schema);
