const express=require('express')
const router = express.Router();
const Course = require('../models/course');
const Lesson = require('../models/lesson');
router.use(express.static('public')); 
const checkuser=require('../middlewares/login').checkuser
router.get('/',async(req,res)=>{
  const courses=await Course.find()
  res.render('courses.ejs',{courses:courses})
})



router.use(checkuser) 

router.use((req, res, next) => {

  if(req.user.role==="admin")
    next();
  else{
    console.log("not allowed")
    return res.redirect('/') 
  }
});
 
 

router.get('/dashboard',async(req,res)=>{
  const courses=await Course.find()
  res.render('dashboards/coursesDashboard.ejs',{courses:courses})
 
})
 
router.delete('/delete/:id',async(req,res)=>{
  await Course.findByIdAndDelete(req.params.id)
  let lessons =await Lesson.deleteMany({course:req.params.id})
  res.redirect('/courses/dashboard')
    
})  

    
router.get('/update/:id',async(req,res)=>{
  const course=await Course.findById(req.params.id)
  res.render('updatecourse.ejs',{course:course})
})
  
 
router.put('/update/:id',async(req,res)=>{

  const course=await Course.findById(req.params.id)
  course.title=req.body.title
  course.description=req.body.description

  await course.save()
  res.redirect('/courses/dashboard')
   
})
    
   
router.post('/new',async(req,res)=>{
    const course= new Course({
      title:req.body.title,
      description:req.body.description
    })
    await course.save()
    res.redirect('/courses/dashboard') 
})



module.exports=router       