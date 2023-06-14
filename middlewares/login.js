const jwt=require('jsonwebtoken')
const User = require('../models/user');

function clearCookie(){
    res.clearCookie('token');
    res.clearCookie('refreash');
}


exports.jwtAuth=(req,res,next)=>{
    const refreash=req.cookies.refreash
    const token=req.cookies.token

    if(refreash&&token){
      jwt.verify(token,process.env.MY_SECRET,(err, user) => {     
        if (err) {
          clearCookie()
        }else{
          req.user = user 
        } 
      })
      

      jwt.verify(refreash,process.env.REFREASH,(err, user) => {     
        if (err) {
          clearCookie()
        }
      })

    }
    else if(refreash){
      //verifying refreash token
        jwt.verify(refreash,process.env.REFREASH,async(err, user) => {     
            if (err) {
              clearCookie()
            } 
            else{
              //generating access token
              let accessToken=jwt.sign(user,process.env.MY_SECRET)
              res.cookie('token',accessToken,{
                httpOnly:true,
                expires: new Date(Date.now() + 2 * 60 * 60 * 1000)
              })
              req.user=user
            }
          }) 
        }
        else if(token){
          jwt.verify(token,process.env.MY_SECRET,(err, user) => {     
            if (err) {
              clearCookie()
            }else{
              req.user = user 
            } 
          })
        }


      next() 
} 

exports.checkuser=(req,res,next)=>{
    const token=req.cookies.token
    if(token===undefined){
      return res.redirect('/login')
    }   
    next()
  }