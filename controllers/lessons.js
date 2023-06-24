const express=require('express')
const router = express.Router();
const Lesson = require('../models/lesson');
const Course = require('../models/course');
const fileUpload = require("express-fileupload");
const path = require("path");
router.use(express.static('public')); 
const {checkuser,adminOnly,jwtAuth,adminAndUser}=require('../middlewares/midddlewares')
const filesPayloadExists = require('../middlewares/filesPayloadExists');
const fileExtLimiter = require('../middlewares/fileExtLimiter');
const fileSizeLimiter = require('../middlewares/fileSizeLimiter');




router.get('/lesson/:id',jwtAuth,adminAndUser,async(req,res)=>{
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
  
  router.use(jwtAuth) 
  router.use(checkuser) 
  router.use(adminOnly) 


  router.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg','.mp4']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files)

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })

        return res.json({ status: 'success', message: Object.keys(files).toString() })
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
    
    
    
    
    router.use((req, res, next) => {
      if(req.user.role==="admin")
      next();
      else{
        console.log("not allowed")
        return res.redirect('/') 
      }
    });
    
    
    
    
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
      res.redirect(`/lessons/${Id}`)
    })



    module.exports=router  