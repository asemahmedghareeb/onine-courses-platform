const express=require('express')
const router = express.Router();
const Course = require('../models/course');
const Lesson = require('../models/lesson');
const jwtAuth=require('../middlewares/login').jwtAuth
router.get('/',jwtAuth,async(req,res)=>{
    if(req.user){
        if(req.user.role==='admin'){
            return res.render('adminProfile.ejs',{name:req.user.name})
        }
        else if(req.user.role==='user'){
            const course= await Course.findOne({title:req.user.courses[0]})
    
            return res.render('userProfile.ejs',{name:req.user.name,course:course})
        }
    }

    res.render('Error.ejs',{error:"ليس لديك حساب"})
    
    
}) 



router.get('/:id',async(req,res)=>{
    let Id=req.params.id
    //getting the title to view on the lessons page
    const course=await Course.findById(Id)
    title=course.title
    
    //getting all the lessons
    const Lessons=await Lesson.find({course:Id}).sort({lessonNumber:1})
    res.render("userLessons.ejs",{lessons:Lessons,id:Id,title:title})  
}) 
  
module.exports=router     