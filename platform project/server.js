const dotenv=require('dotenv').config()
const express=require('express')
const mongoose = require('mongoose');
const path=require('path')
const port=process.env.PORT
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
mongoose.connect('mongodb+srv://asem:123@cluster0.etxylsx.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database'));
   

      

      
  
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
app.listen(port,()=>{
  console.log(`serve is running on port ${port}`)

})