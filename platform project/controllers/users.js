const express=require('express')
const router = express.Router();
const User = require('../models/user');
const Course = require('../models/course');

//get all users
router.get('/',async(req,res)=>{
    const Users=await User.find()
    console.log(Users)
  res.render('dashboards/usersDashboard.ejs',{users:Users})
})




//delete user
router.delete('/:id',async(req,res)=>{
    const Users=await User.findByIdAndDelete(req.params.id)
    // console.log(Users)
    res.redirect('/users/')
})

//create new user
router.post('/new',async(req,res)=>{
    const {name,password,email,role,course}=req.body
    //hashing passwords
    const course2=await Course.findOne({title:course})
    
    console.log(course2)
    if(course2!==null){
        const user=new User({
            name:name,
            email:email,
            password:password, 
            role:role,
            courses:course,
            coursesId:course2.id
        })
        
          await user.save()
          console.log(user)
    }
    else 
        console.log('this course not found');

  res.redirect('/users/')
})


//get update
router.get('/:id',async(req,res)=>{
    res.render('updateUser.ejs',{id:req.params.id})
})

//update
router.put('/:id',async(req,res)=>{

    
    const {name,password,email,role,course}=req.body
    const course2=await Course.findOne({title:course})
    console.log(course2)
    if(course2!==null){
        const user=await User.findById(req.params.id)
        user.name=name
        user.email=email,
        user.password=password
        user.role=role
        user.courses=course
        user.coursesId=course2.id
        await user.save()
        console.log(user)
    }
    else 
        console.log('this course not found');

  res.redirect('/users/')
})




module.exports=router