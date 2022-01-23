const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://Jihana:Jihaan%40123@cluster0.xi6vh.mongodb.net/JobConsultancy?retryWrites=true&w=majority",()=>
 {
   console.log(" Database Successfully Connected")
 })

const Schema=mongoose.Schema;
const registerSchema=new Schema({
  login_id:{type:mongoose.Schema.Types.ObjectId, ref:"signin"},
  firstname:String,
  lastname:String,
  email:String,
  phone:Number,
  role:String,
})
const registerData=mongoose.model("Register",registerSchema)
module.exports=registerData;