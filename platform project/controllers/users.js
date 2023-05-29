const express=require('express')
const router = express.Router();
const User = require('../models/user');
const Course = require('../models/course');

//get all users
router.get('/',async(req,res)=>{
    const Users=await User.find()
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
    
    if(course2 ){
        const user=new User({
            name:name,
            email:email,
            password:password, 
            role:role,
            courses:course,
            coursesId:course2.id
        })
         
          await user.save()

    }else if(role==='admin'){
        const user=new User({
            name:name,
            email:email,
            password:password, 
            role:role,
            courses:course,
        })
        await user.save()

    }
    else 
        console.log('this course not found');

  res.redirect('/users/')
})

 
//get update page  
router.get('/:id',async(req,res)=>{
    const user=await User.findById(req.params.id)
    res.render('updateUser.ejs',{id:req.params.id , user:user})
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
    else if(role==='admin'){
        user.name=name
        user.email=email,
        user.password=password
        user.role=role
        user.courses=course
        await user.save()
    }
    else 
        console.log('this course not found');
 
  res.redirect('/users/')
})




module.exports=router