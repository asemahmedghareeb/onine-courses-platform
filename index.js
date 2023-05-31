require('dotenv').config()
const express=require('express')
const mongoose = require('mongoose');
const path=require('path')

const app=express()
express.json()
const methodOverride = require('method-override')


//middleware
app.use(express.static('public')); 
app.set('view-engine',"ejs")
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
       
//import routers
const loginRouter=require('./controllers/auth/login')
const registerRouter=require('./controllers/auth/register')
const couresRouter=require('./controllers/courses')
const lessonsRouter=require('./controllers/lessons')
const profileRouter=require('./controllers/profile')
const usersRouter=require('./controllers/users')
    
  
//database connection
const connectDB=async()=>{
  try{
    const con=await mongoose.connect(process.env.CONN)
    console.log(`connected to DB ${con.connection.host}`);
  }catch(err){
    console.log('Error connecting to database')
    console.log(err)
    process.exit(1)
  }
}
   

      

      
  
//home page router
app.get('/',(req,res)=>{
  res.render('home.ejs')
})

app.use('/login',loginRouter)
app.use('/register',registerRouter)
app.use('/courses',couresRouter)
app.use('/lessons',lessonsRouter)
app.use('/profile',profileRouter)
app.use('/users',usersRouter)

    
    

//running the sever
connectDB().then(()=>{
  app.listen(process.env.PORT||5000,()=>{
    console.log(`serve is running on port ${process.env.PORT}`)
    
  })
}) 