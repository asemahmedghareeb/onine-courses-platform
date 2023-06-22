const express=require('express')
const router = express.Router();
const User=require('../../models/user')
router.get('/',(req,res)=>{
  res.render('auth/register.ejs')
})


router.post ('/',async(req,res)=>{
  // const {name,email,pass}

  res.redirect('/users/new')
})



module.exports=router