import { Schema,model,models } from "mongoose";
const schema=new Schema({publicId:{type:String,unique:true,required:true},title:{type:String,required:true},body:{type:String,required:true},noticeType:{type:String,enum:["exam","holiday","policy","captain_responsibility","other"],required:true},authority:{type:String,required:true},effectiveDate:Date,active:{type:Boolean,default:true,index:true},isDemo:{type:Boolean,default:false,index:true},createdBy:Schema.Types.ObjectId},{timestamps:true,strict:"throw"});
schema.index({title:"text",body:"text"});
export const OfficialNotice=models.OfficialNotice||model("OfficialNotice",schema);
