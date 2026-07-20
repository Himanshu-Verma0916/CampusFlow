const jwt =require('jsonwebtoken');

const auth =async(req,res,next)=>{
    try {
        
        // let token= req.headers.authorization;
        let token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }

        // token=token.split(" ")[1];
        const decoded =jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();

    } catch (error) {
       res.status(401).json({message:"Unauthorized"}); 
    }
}

module.exports=auth;