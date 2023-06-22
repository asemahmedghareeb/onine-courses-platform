const express=require('express')
const router = express.Router();
const User = require('../models/user');
const Course = require('../models/course');
router.use(express.static('public')); 
const bcrypt=require('bcrypt')
const {checkuser, adminOnly,userOnly}=require('../middlewares/midddlewares')

router.post('/new',async(req,res)=>{
    const {name,password,email,number}=req.body
    //we should make validation for email to chech if it is dublicated or not
    if(await isEmailDoublicatedOrNot(email)){
      return res.render('Error.ejs',{error:"الاميل الذي ادخلته مستخدم من قبل"})
    } 

    //hashing passwords
    let hashedPass=await bcrypt.hash(password,10)

    const user=new User({
        name:name, 
        email:email,  
        password:hashedPass,  
        phone_number:number    
    })
      
    await user.save()
    if(req.user){
      if(req.user.role)
      res.redirect('/users')
      res.redirect('login')
    } 
    else
      res.redirect('/login')
})
//adding new course
router.use(checkuser)

router.get('/newCourse/:id',userOnly, async(req,res)=>{
  const user=req.user;
  const course= await Course.findById(req.params.id)

  await User.updateOne(
    {name:user.name},
    {$push:{courses:course.title}}
  ) .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });

  res.redirect('/profile')
})

router.use(adminOnly); 

//get all users
router.get('/',async(req,res)=>{
    const Users=await User.find()
    const names=await Course.find({}, 'title') 
    res.render('dashboards/usersDashboard.ejs',{users:Users,names:names})
})



//delete user
router.delete('/:id',async(req,res)=>{
    await User.findByIdAndDelete(req.params.id)
    res.redirect('/users/')
})

async function isEmailDoublicatedOrNot (email){
  const u=await User.findOne({email:email})
  console.log(u) 
  if(u){
    console.log("doublicated")
    return true
  }
  return false
}


//create new user

 
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
