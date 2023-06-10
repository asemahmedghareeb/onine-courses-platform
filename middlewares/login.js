const jwt=require('jsonwebtoken')
exports.jwtAuth=(req,res,next)=>{
    const token=req.cookies.token

       jwt.verify(token,process.env.MY_SECRET,(err, user) => {     
            if (err) {
                console.log("invalid token")
                next()
            }else{

                req.user = user 
                console.log("verified")
                next()

            }

        })

} 


