const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://Jihana:Jihaan%40123@cluster0.xi6vh.mongodb.net/JobConsultancy?retryWrites=true&w=majority",()=>{
  console.log("database connected")
})
const schema= new mongoose.Schema({
  username:String,
  password:String,
  resetToken:String,
   expireToken:String,
})
const loginDb=mongoose.model("signin",schema)
module.exports=loginDb;