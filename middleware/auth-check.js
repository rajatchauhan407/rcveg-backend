const jwt= require("jsonwebtoken");
const User = require('../models/user');
module.exports= (req,res,next)=>{
   
    try{
        if(req.headers.authorization){
        const token= req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token,process.env.JWT_KEY);
        console.log(decodedToken);
        const contactNo = decodedToken.contact;
        User.findOne({
            phoneNo : contactNo
        }).then((result) => {
        //    console.log(result);
          req.userId = result._id.toString();
          next();
          console.log(req.userId + "hello");
        }).catch(error =>{
            console.log(error);
        });
        }else{
            console.log("working");
            next();
        }  
    }catch(error){
        res.status(401).json({
            message:'Auth Failed'
        });
    }
};