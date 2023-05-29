const dotenv=require('dotenv').config()
const express=require('express')
const path=require('path')
const port=process.env.PORT
const app=express()
express.json()
const methodOverride = require('method-override')

//import routers
const loginRouter=require('./controllers/auth/login')
const registerRouter=require('./controllers/auth/register')
const couresRouter=require('./controllers/courses')
const lessonsRouter=require('./controllers/lessons')
const profileRouter=require('./controllers/profile')
const usersRouter=require('./controllers/users')
//middleware
app.set('view-engine',"ejs")


// Serve static files from the "public" directory
app.use(express.static('public'));



// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


//database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://asem:123@cluster0.etxylsx.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database', err));



 
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