const express=require('express')
const jwt=require('jsonwebtoken')
const User = require('../../models/user');
const { checkuser } = require('../../middlewares/login');
const router = express.Router();
const jwtAuth=require('../../middlewares/login').jwtAuth


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
      console.log(info)
      const token= jwt.sign(info,process.env.MY_SECRET,{expiresIn:"2h"})
      res.cookie('token',token,{
        httpOnly:true,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000)

      })
      
      const refreshToken= jwt.sign(info,process.env.REFREASH,{expiresIn:"7d"})
      res.cookie('refreash',refreshToken,{
        httpOnly:true,
        expires:  new Date(Date.now()+7 * 24 * 60 * 60 * 1000 )
      })

      console.log("from login route"+refreshToken, token)
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