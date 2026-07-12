import { Schema,model,models } from "mongoose";
const schema=new Schema({pollId:{type:Schema.Types.ObjectId,required:true,index:true},anonymousVoterToken:{type:String,required:true,select:false},choice:{type:String,required:true},createdAt:{type:Date,default:Date.now},isDemo:{type:Boolean,default:false,index:true}},{strict:"throw"});
schema.index({pollId:1,anonymousVoterToken:1},{unique:true});
export const AnonymousVote=models.AnonymousVote||model("AnonymousVote",schema);
