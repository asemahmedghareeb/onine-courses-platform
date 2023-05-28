const express=require('express')
const router = express.Router();
const Lesson = require('../models/lesson');
const Course = require('../models/course');
  
//read
//this id is course id 
router.get('/:id',async(req,res)=>{
    let Id=req.params.id
    //getting the title to view on the lessons page
    const course=await Course.findById(Id)
    title=course.title
    

    //getting all the lessons
    const Lessons=await Lesson.find({course:Id}).sort({lessonNumber:1})
    res.render("course_lessons.ejs",{lessons:Lessons,id:Id,title:title})
 
    
}) 
router.get('/show/:id',async(req,res)=>{
    let Id=req.params.id
    //getting the title to view on the lessons page
    const course=await Course.findById(Id)
    title=course.title
    

    //getting all the lessons
    const Lessons=await Lesson.find({course:Id})
    res.render("lessons.ejs",{lessons:Lessons,id:Id,title:title})
 
})  
     
//delete
//this id is lesson id
router.delete('/delete/:id',async(req,res)=>{
  
    const lesson=await Lesson.findByIdAndDelete(req.params.id)
    let course=lesson.course
    let courseId=course.toString()

    res.redirect(`/lessons/${courseId}`)
}) 

//create   
//this is course id
router.post('/new/:id',async(req,res)=>{
    let Id=req.params.id
  
    const lesson=new Lesson({
        title:req.body.title,
        content:req.body.content,
        course:Id,
        lessonNumber:req.body.lessonNumber
    })

    await lesson.save()
    console.log("created")
    res.redirect(`/lessons/${Id}`)
})




module.exports=router  