const express=require('express')
const router = express.Router();
const User=require('../../models/user')
router.get('/',(req,res)=>{
  res.render('auth/register.ejs')
})
module.exports=router