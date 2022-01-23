const express=require("express");
const userRouter=express.Router()
const applyJob=require("../model/applyJob")
const fs=require("fs")
const loginDb=require("../model/loginDb");
const addJob=require("../model/addJob")
userRouter.get("/apply/:id",(req,res)=>{
  const id=req.params.id;
  res.render("apply",{id})
})
userRouter.post("/applydata/:id",(req,res)=>{
  const id=req.params.id;
 addJob.findOne({_id:id}).then(jobData=>{
   console.log("Job Details"+jobData)
   loginDb.findOne({username:req.body.username}).then(data=>{
    console.log("login data"+data);
    const item={
      job_id:jobData._id,
     login_id:data._id,
     username:req.body.username,
      qualification:req.body.qualification,
      year:req.body.year,
      file:req.body.file
    }
    const applyModel=applyJob(item);
    applyModel.save().then(data=>{
      console.log(data)
      res.redirect(`/user/applyList/${data.login_id}`)

       })
    })
  })
  })

  userRouter.get("/applyList/:login_id",(req,res)=>{
    const id=req.params.login_id
    console.log("login id"+id)
    applyJob.aggregate([
    {
      $lookup:{
        from:"signins",
        localField:"login_id",
        foreignField:"_id",
        as:"newField",
      }},
      { $unwind: "$newField" },
      // {
      //   $lookup:{
      //     from:"addjobs",
      //     localField:"job_id",
      //     foreignField:"_id",
      //     as:"newJobField"
      //   }
      // },
    //   {
    //     $match:{
    //         login_id:id,
    //     }
    //  }
    ]).then(data=>{
      const items=res.json(data[0].newField)

      const items1=JSON.stringify(data[0].newField[0])
      console.log("data are"+data)
      res.render("userJobList",{data})
    }).catch((error) => {
      console.log(error);
    });
    // console.log("login id"+req.params.login_id)
    // applyJob.find({login_id:id}).then((jobDetails)=>{
    //   console.log("Details are"+jobDetails)
    //   for(var i=0;i<jobDetails.length;i++)
    //   {
    //     console.log(jobDetails[i].job_id)
    //   }
      // console.log("job ids are"+jobDetails.job_id)
     // })
    })
module.exports=userRouter;