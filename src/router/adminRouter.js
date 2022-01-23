const express=require("express")
const adminRouter=express.Router();
const addJobDb=require("../model/addJob")
const loginDb=require("../model/loginDb")
adminRouter.get("/addPage",(req,res)=>{
  res.render("addJob")
})
adminRouter.post("/add",(req,res)=>{
  
  const item={
    jobname:req.body.jobname,
    companyname:req.body.companyname,
    desc:req.body.desc,
    location:req.body.location,
    
  }
  const addModel=addJobDb(item);
  addModel.save().then(data=>{
    console.log(data)
    res.redirect("/admin/view")
  })
})
// adminRouter.get("/view",(req,res)=>{
//   res.render("viewJob")
// })
adminRouter.get("/view",(req,res)=>{
  addJobDb.find().then(data=>{
    res.render("viewJob",{data,title:"View"})
  })
})
adminRouter.get("/userView",(req,res)=>{
 
  loginDb.findOne({username:req.body.username}).then(userdata=>{;
   console.log("User details is"+userdata)
   addJobDb.find().then(data=>{
    res.render("user",{data,userdata})
  })
})

  });
  
adminRouter.get("/:id",(req,res)=>{
  const id=req.params.id;
  addJobDb.findOne({_id:id}).then(singleJob=>{
    console.log(singleJob);
    res.render("singleJob",{title:"SinglePage",singleJob})
  })
})
adminRouter.get("/delete/:id1",(req,res)=>{
  const id=req.params.id1;
  
    addJobDb.findByIdAndDelete(id)
        .then(data=>{
          console.log("deleted")
        })
        
  
  res.redirect("/admin/view")
})
adminRouter.get("/edit/:id",(req,res)=>{
  const id=req.params.id;
  
  addJobDb.findOne({_id:id}).then((jobedit)=>{
    console.log(jobedit)
    res.render("edit",{jobedit,title:"EDIT"})
  })
})
adminRouter.post("/update/:id",(req,res)=>{
  const id=req.params.id;
  const item={
    jobname:req.body.jobname,
    companyname:req.body.companyname,
    desc:req.body.desc,
    location:req.body.location,
    
  }
  addJobDb.findByIdAndUpdate(id,item).then(data=>{
    console.log("updated values"+data)
  })
  res.redirect("/admin/view")
})
module.exports=adminRouter;