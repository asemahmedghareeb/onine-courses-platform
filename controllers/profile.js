const express=require('express')
const router = express.Router();
const jwtAuth=require('../middlewares/login').jwtAuth
router.get('/',jwtAuth,(req,res)=>{
    console.log(req.user)
    if(req.user){
        return res.render('profile.ejs',{name:req.user.name})
    }
    res.render('profile.ejs',{name:""})
    
}) 
module.exports=router     