const jwt= require("jsonwebtoken");
const Admin = require('../models/admin');
module.exports= (req,res,next)=>{
    try{
        const token= req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token,process.env.JWT_KEY);
        //  console.log(decodedToken);
        const email = decodedToken.email;
        Admin.findOne({
            'email': email
        }).then((result) => {
             console.log(result);
           res.locals.userId = result._id.toString();
        //    console.log(res.locals.userId + "hello");
        next();
        })
    }catch(error){
        res.status(401).json({
            message:'Auth Failed'
        })
    }
};