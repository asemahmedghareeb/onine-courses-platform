const express=require('express')
const router = express.Router();
const Lesson = require('../models/lesson');
const Course = require('../models/course');
  
//this id is course id 
router.get('/:id',async(req,res)=>{
    let Id=req.params.id
    //getting the title to view on the lessons page
    const course=await Course.findById(Id)
    title=course.title
    

    //getting all the lessons
    const Lessons=await Lesson.find({course:Id})
    res.render("course_lessons.ejs",{lessons:Lessons,id:Id,title:title})
 
})
    

//this id is lesson id
router.delete('/delete/:id',async(req,res)=>{
  
    const lesson=await Lesson.findByIdAndDelete(req.params.id)
    console.log(lesson.course.id)
    
    // console.log("id"+lesson.course)
    res.sendStatus(`/lessons/:${lesson.course}`)
})


//this is course id
router.post('/new/:id',async(req,res)=>{
    let Id=req.params.id
  
  
    console.log(Id)
    const lesson=new Lesson({
        title:req.body.title,
        content:req.body.content,
        course:Id
    })

    await lesson.save()
    console.log("created")
    res.redirect(`/lessons/${Id}`)
})




module.exports=router  