const jwt=require('jsonwebtoken')
exports.jwtAuth=(req,res,next)=>{
    const refreash=req.cookies.refreash
    const token=req.cookies.token

    if(refreash&&token){
        jwt.verify(token,process.env.MY_SECRET,(err, user) => {     
            if (err) {
                console.log("invalid access token")
            }else{
                req.user = user 
            } 
        })
        
        jwt.verify(refreash,process.env.REFREASH,(err, user) => {     
            if (err) {
                console.log("invalid refreash token") 
            }else{
                req.user = user 
            }
        })
    }
    else if(refreash){
        //verifying refreash token
        jwt.verify(refreash,process.env.REFREASH,(err, user) => {     
            if (err) {
                console.log("invalid refreash token")
                return res.redirect('/login')
            }
            else{
                //generating access token
                let accessToken=jwt.sign(user,process.env.MY_SECRET)

                res.cookie('token',accessToken,{
                    httpOnly:true,
                    expires: new Date(Date.now() + 2 * 60 * 60 * 1000)
                  })
                console.log('new access token')
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