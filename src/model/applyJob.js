const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://Jihana:Jihaan%40123@cluster0.xi6vh.mongodb.net/JobConsultancy?retryWrites=true&w=majority",()=>{
  console.log("database connected")
})
const Schema=mongoose.Schema;
const applySchema= new Schema({
  login_id:{type:Schema.Types.ObjectId, ref:"signin"},
  job_id:{type:Schema.Types.ObjectId, ref:"addJob"},
  username:String,
  qualification:String,
  year:String,
file:String,
})
const applyJob=mongoose.model("apply",applySchema)
module.exports=applyJob;