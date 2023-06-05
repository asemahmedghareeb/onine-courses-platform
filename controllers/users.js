const express=require('express')
const router = express.Router();
const User = require('../models/user');
const Course = require('../models/course');
router.use(express.static('public')); 
//get all users
router.get('/',async(req,res)=>{
    const Users=await User.find()
    const names=await Course.find({}, 'title') 
    res.render('dashboards/usersDashboard.ejs',{users:Users,names:names})
})


//delete user
router.delete('/:id',async(req,res)=>{
    const Users=await User.findByIdAndDelete(req.params.id)
    res.redirect('/users/')
})

//create new user
router.post('/new',async(req,res)=>{
    const {name,password,email,role,course}=req.body
    //hashing passwords
    //we should make validation for email to chech if it is dublicated or not
    const course2=await Course.findOne({title:course})

    id=course2.id
    const user=new User({
        name:name,
        email:email,
        password:password, 
        role:role,
        courses:course,
        coursesId:id
    })
         
    await user.save()
    res.redirect('/users/')
})

 
//get update page  
router.get('/:id',async(req,res)=>{
    const user=await User.findById(req.params.id)
    const names=await Course.find({}, 'title') 
    res.render('updateUser.ejs',{id:req.params.id , user:user,names:names})
})

//update user information
router.patch('/:id',async(req,res)=>{
    const {name,password,email,role,course}=req.body
    const course2=await Course.findOne({title:course})

    const user=await User.findById(req.params.id)
    if(course2 ){
        user.name=name
        user.email=email,
        user.password=password
        user.role=role
        user.courses=course
        user.coursesId=course2.id
        await user.save()
    }
  res.redirect('/users/')
})
module.exports=router