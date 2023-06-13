const jwt=require('jsonwebtoken')
const User = require('../models/user');
exports.jwtAuth=(req,res,next)=>{
    const refreash=req.cookies.refreash
    const token=req.cookies.token
    function clearCookie(){
        res.clearCookie('token');
        res.clearCookie('refreash');
    }
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
                console.log("invalid refreash token")
                clearCookie()

            }
            else{
                //generating access token
                const user=await User.findById(user.id)
                const info={
                    name:user.name,
                    role:user.role,
                    courses:user.courses
                }
                
                let accessToken=jwt.sign(info,process.env.MY_SECRET)
                res.cookie('token',accessToken,{
                    httpOnly:true,
                    expires: new Date(Date.now() + 2 * 60 * 60 * 1000)
                  })
            }
        }) 
    }
    next()
} 

exports.checkuser=(req,res,next)=>{
    const token=req.cookies.token
    if(token===undefined){
        console.log("not loged")

        return res.redirect('/login')
    } 
    next()
}