const jwt= require("jsonwebtoken");
const User = require('../models/user');
module.exports= (req,res,next)=>{
   
    try{
        const token= req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token,process.env.JWT_KEY);
        //  console.log(decodedToken);
        const contactNo = decodedToken.contact;
        User.find({
            'phoneNo' : contactNo
        }).then((result) => {
          res.locals.userId = result[0]._id.toString();
          console.log(res.locals.userId + "hello");
        }).catch(error =>{
            console.log(error);
        });
        next();
    }catch(error){
        res.status(401).json({
            message:'Auth Failed'
        })
    }
};