const express=require('express')
const router = express.Router();
const Lesson = require('../models/lesson');
const Course = require('../models/course');const fs = require('fs');
const fileUpload = require("express-fileupload");
const path = require("path");
router.use(express.static('public')); 
const {checkuser,adminOnly,adminAndUser}=require('../middlewares/midddlewares')
const filesPayloadExists = require('../middlewares/filesPayloadExists');
const fileExtLimiter = require('../middlewares/fileExtLimiter');
const fileSizeLimiter = require('../middlewares/fileSizeLimiter');




router.get('/lesson/:id',adminAndUser,async(req,res)=>{
  let Id=req.params.id
  //getting the title to view on the lessons page
  const lesson=await Lesson.findById(Id)
  
  res.render("lesson_vid_page.ejs",{lesson:lesson})  
});
   
//read
//this id is course id 
router.get('/show/:id',async(req,res)=>{
  let Id=req.params.id
    //getting the title to view on the lessons page
    const course=await Course.findById(Id)
    title=course.title
    
    //getting all the lessons
    let Lessons=await Lesson.find({course:Id})
    res.render("lessons.ejs",{lessons:Lessons,id:Id,title:title})
  })   
    
  router.use(checkuser) 
  router.use(adminOnly) 

  router.get('/lessonUpload/:id',async(req,res)=>{
    let Id=req.params.id
    console.log(Id)
    //getting the title to view on the lessons page 
    const lesson=await Lesson.findById(Id)
    console.log(lesson)
    res.render("dashboards/lesson_vid_upload.ejs",{lesson:lesson})  
  });
      
    
  router.post('/upload/:id',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg','.mp4']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files)

        Object.keys(files).forEach(key => {
            const filepath = path.join(`${path.dirname(__dirname)}`, 'public\\videos',req.params.id)//files[key].name
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })
        
        return res.json({ status: 'success', message: Object.keys(files).toString() ,url:""})
    }
)

 


  router.get('/:id',async(req,res)=>{
      let Id=req.params.id
      //getting the title to view on the lessons page
      const course=await Course.findById(Id)
      title=course.title
      //getting all the lessons
      const Lessons=await Lesson.find({course:Id}).sort({lessonNumber:1})
      res.render("dashboards/course_lessons.ejs",{lessons:Lessons,id:Id,title:title})  
  }) 
    
    
     


    //delete
    //this id is lesson id
    router.delete('/delete/:id',async(req,res)=>{
      const lesson=await Lesson.findByIdAndDelete(req.params.id)
      let course=lesson.course
      let courseId=course.toString()
      const filePath =  path.join(`${path.dirname(__dirname)}`, 'public\\videos',req.params.id)
       fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`${filePath} has been deleted.`);
      });
      res.redirect(`/lessons/${courseId}`)
    }) 
     
//create   
//this is course id
router.post('/new/:id',async(req,res)=>{
  let Id=req.params.id
  
  const lesson=new Lesson({
    title:req.body.title,
    course:Id,
    lessonNumber:req.body.lessonNumber
  })
  await lesson.save()
  res.redirect(`/lessons/lessonUpload/${lesson.id}`)
})
 
module.exports=router  