const express=require('express')
const router = express.Router();
const User=require('../../models/user')
router.get('/',(req,res)=>{
  if(req.user){
    res.render("Error.ejs",{error:"لقد قمت بتسجيل الدخول"})
  }
  else{
    res.render('auth/register.ejs')
  }
})
module.exports=router