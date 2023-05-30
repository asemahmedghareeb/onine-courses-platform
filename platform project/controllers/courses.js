const express=require('express')
const router = express.Router();
const Course = require('../models/course');
const Lesson = require('../models/lesson');
router.get('/',async(req,res)=>{
  const courses=await Course.find()
  
  res.render('courses.ejs',{courses:courses})
})




router.get('/dashboard',async(req,res)=>{
  const courses=await Course.find()
  res.render('dashboards/coursesDashboard.ejs',{courses:courses})
 
})
 
// modify this when we add the lessons
//when we delete course we have to delete all it's lessons
router.delete('/delete/:id',async(req,res)=>{
  await Course.findByIdAndDelete(req.params.id)
  let lessons =await Lesson.deleteMany({course:req.params.id})
  res.redirect('/courses/dashboard')
    
})  

    
router.get('/update/:id',async(req,res)=>{
  const course=await Course.findById(req.params.id)
  res.render('update.ejs',{course:course})
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