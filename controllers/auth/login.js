const express=require('express')
const jwt=require('jsonwebtoken')
const User = require('../../models/user');
const { checkuser,jwtAuth } = require('../../middlewares/login');
const router = express.Router();



router.get('/',jwtAuth,(req,res)=>{
  
  if(req.user){
     res.redirect("/profile")
  }
  else
  res.render('auth/login.ejs',{error:""})
})

  
router.post ('/',async(req,res)=>{
 
   
 
  const{email,  password}=req.body
  const user=await User.findOne({email:email})

  if(user&& user.password===password){
    //checking the password
    if(user.password===password){
      const info={
        name:user.name,
        role:user.role,
        courses:user.courses
      }
      
      //genetating access token 

      const token= jwt.sign(info,process.env.MY_SECRET)
      res.cookie('token',token,{
        httpOnly:true,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000)
      
      })
      //generate refreash token
      const refreshToken= jwt.sign(info,process.env.REFREASH)
      res.cookie('refreash',refreshToken,{
        httpOnly:true,
        expires:  new Date(Date.now()+7 * 24 * 60 * 60 * 1000 )

      })

      res.redirect('/profile')
    } 
  }  
  else{
    //if the password and email is wrong
    console.log("bug")
    return  res.render("auth/login.ejs",{error:"password or email is wrong"})
  }
}) 
module.exports=router        