const express=require("express");
const homeRouter=express.Router();
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser");
const crypto = require('crypto')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const nodemailer = require('nodemailer')
const mongoose=require("mongoose")
const registerDb=require("../model/registerDb");
const registerModel=mongoose.model.registerDb
const loginDb=require("../model/loginDb");
const addJobDb = require("../model/addJob");
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '248717930022-5muitfucmhqpbk7c6h4nr8d6g5ls5ksn.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);
homeRouter.use(express.json());
homeRouter.use(cookieParser());
const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
      api_key:"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"
  }
}))
homeRouter.get("/",(req,res)=>{
  res.render("Annexe")
})
homeRouter.get("/signup",(req,res)=>{
  res.render("register")
})
homeRouter.post("/register",(req,res)=>{
  bcrypt.hash(req.body.password,10,(error,data)=>{
    if(error){
      console.log(error)
    }
    else
    {
      console.log(data)
    }
    const items={
      username:req.body.email,
      password:data,
    }
    const loginModel=loginDb(items);
    loginModel.save().then(()=>{
      loginDb.findOne({username:items.username}).then(datas=>{
        const id=datas._id;
        const registerItems={
          login_id:id,
          firstname:req.body.firstname,
         lastname:req.body.lastname,
         email:req.body.email,
       phone:req.body.phone,
       role:req.body.role,
       
        }
        const registerModel=registerDb(registerItems);
     registerModel.save().then(data=>{
       console.log("details are"+data)
       transporter.sendMail({
         to:data.email,
         from:"noreplyemail120@gmail.com",
         subject:"signup successfull",
         html:"<h2>Welcome....</h2>"
       })
       registerDb.aggregate([{
        $lookup:{
          from:"signins",
          localField:"login_id",
          foreignField:"_id",
          as:"newField"
        }
      }]).then(data=>{
        console.log("all over details is "+data)
      })
       res.redirect("/already")
     })
        
      })
    })
  })
  
  
  
});

homeRouter.get("/already",(req,res)=>{
  res.render("login")
})
homeRouter.post("/login",(req,res)=>{
  console.log( "username:"+req.body.username)
  loginDb.findOne({username:req.body.username}).then((datass)=>{
    console.log("datas are"+datass)
    if(!datass)
    {
      console.log("user not found")
    }
    else
    {
      bcrypt.compare(req.body.password,datass.password).then((data)=>{
        if(!data)
        {
          console.log("error")
        }
        else
        {
          console.log("password correct")
          addJobDb.find().then(data=>{
            console.log("job details"+data)
            registerDb.findOne({login_id:datass.id}).then((registerDetails)=>{
              console.log(registerDetails);
              
              console.log("username is "+req.body.username)
              if(registerDetails.role=="User"){
              res.render("user",{data,registerDetails})
              }
              else
              {
                res.redirect("/admin/view")
              }
            })
          })
          
          
        }
      })
    }
  })
  
})
homeRouter.post('/googleLogin', (req,res)=>{
  let token = req.body.token;

  async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
    }
    verify()
    .then(()=>{
        res.cookie('session-token', token);
        res.send('success')
    })
    .catch(console.error);

})

homeRouter.get('/logout', (req, res)=>{
  res.clearCookie('session-token');
  res.redirect('/already')

})
// homeRouter.get('/profile', checkAuthenticated, (req, res)=>{
//   let user = req.user;
//   res.render('user');
// })
homeRouter.get("/userdetails",checkAuthenticated,(req,res)=>{
  let user = req.user;
  addJobDb.find().then(data=>{
    console.log("job details"+data)
    res.render("googleuser",{data,user})
    // registerDb.findOne({login_id:datass.id}).then((registerDetails)=>{
    //   console.log(registerDetails);
      
    //   console.log("username is "+req.body.username)
      // if(registerDetails.role=="User"){
      // res.render("googleuser",{data,user})
      // }
      // else
      // {
      //   res.redirect("/admin/view")
      // }
    })
  })
  

homeRouter.get("/forgot",(req,res)=>{
  res.render("reset")
})
homeRouter.post("/reset-password",(req,res)=>{
  // res.send("hello")
  // crypto.randomBytes(32,(err,buffer)=>{
  //     if(err){
  //         console.log(err)
  //     }
  //     const token = buffer.toString("hex")
      // console.log("token is "+token)
      console.log(req.body.email)
     loginDb.findOne({username:req.body.email})
      .then(user=>{
        const token = user._id;
        console.log("user data isss"+user)
          if(!user){
              return res.status(422).json({error:"User don't exists with that email"})
          }
          
         
           
           user. resetToken =token,
         user. expireToken = Date.now() + 3600000
         user.save().then((result)=>{
           console.log("data iss"+result)
              transporter.sendMail({
                  to:user.username,
                  from:"noreplyemail120@gmail.com",
                  subject:"password reset",
                  html:`
                  <p>You requested for password reset</p>
                  <h5>click in this <a href="http://localhost:1234/reset/${token}">link</a> to reset password</h5>
                  `
              })
              res.send(" Please check your email")
          })
        })
      })
  


homeRouter.get("/reset/:token",(req,res)=>{
  const id=req.params.token;
  console.log("token issss"+id)
  res.render("newPassword",{id})
})
homeRouter.post("/resetPassword/:id",(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.params.id
  
  console.log("token is "+sentToken+"password is"+newPassword)
  loginDb.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}}).then(data=>{
    console.log("dataaa"+data)
    if(data)
    {
      bcrypt.hash(newPassword,10,(error,response)=>{
        data.password=response;
        data.save().then(newData=>{
          console.log("succcessfully updated"+newData)
          res.redirect("/already")
          
        })
      })
    }
  })
})
function checkAuthenticated(req, res, next){

  let token = req.cookies['session-token'];

  let user = {};
  async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      user.name = payload.name;
      user.email = payload.email;
      user.picture = payload.picture;
    }
    verify()
    .then(()=>{
        req.user = user;
        next();
    })
    .catch(err=>{
        res.redirect('/userdetails')
    })

}
module.exports=homeRouter;