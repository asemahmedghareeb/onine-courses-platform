const express=require('express')
const router = express.Router();

router.get('/',(req,res)=>{
  res.render('auth/register.ejs')
})


module.exports=router