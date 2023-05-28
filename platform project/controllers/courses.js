const express=require('express')
const router = express.Router();
const app=express()
app.set('view-engine',"ejs")
express.json()
const Course = require('../models/course');

router.get('/',async(req,res)=>{
  const courses=await Course.find()
  // console.log(courses)
  res.render('courses.ejs',{courses:courses})
})


router.get('/dashboard',async(req,res)=>{
  const courses=await Course.find()
  res.render('coursesDashboard.ejs',{courses:courses})
 
})

// modify this
router.delete('/delete/:id',async(req,res)=>{
  await Course.findByIdAndDelete(req.params.id)
  res.redirect('/courses/dashboard')

}) 
     
router.get('/update/:id',async(req,res)=>{
  const course=await Course.findById(req.params.id)
  res.render('update.ejs',{course:course})
})
  

router.put('/update/:id',async(req,res)=>{
  console.log(req.body.title)
  const course=await Course.findById(req.params.id)
  console.log(course)
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