const express=require("express")
const app=express();
const cookieParser=require("cookie-parser")
app.use(express.urlencoded({extended:true}))
  app.set("view engine","ejs");
  app.use(express.json());
app.use(cookieParser());
  app.set("views",'./src/view');
  app.use(express.static("./public"))
const homeRouter=require("./src/router/homeRouter")
app.use("/",homeRouter)
const adminRouter=require("./src/router/adminRouter")
app.use("/admin",adminRouter)
const userRouter=require("./src/router/userRouter");
app.use("/user",userRouter)
app.listen(1234,()=>{
  console.log("server is listening...http://localhost:1234")
})