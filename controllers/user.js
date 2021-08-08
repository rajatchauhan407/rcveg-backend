const User = require("../models/user");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

// creating the user and otp verification

const generateOtp = (phoneNo) => {
  const promise = new Promise((resolve, reject) => {
    var accountSid = process.env.AuthId;
    var authToken = process.env.AuthKey;
    var twilio = require("twilio");
    var client = new twilio(accountSid, authToken);
    val = Math.floor(1000 + Math.random() * 9000);
    // console.log(message.dateCreated);
    client.messages
      .create({
        body: `Your Veggies verification Code is ${val}`,
        to: "+91" + phoneNo,
        from: "+19123488069",
      })
      .then((message) => {
        resolve(val);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};


/************Create User ***********/
let OTP;
let CONTACT;
exports.createUser = (req, res, next) => {
  // console.log(req.body.contact);
  const contactNo = req.body.contact;
  CONTACT = req.body.contact;
  const user = new User({
    phoneNo : contactNo
  });
 
  generateOtp(contactNo)
    .then((data) => {
      const otpSent = data;
      OTP = data;
      const token = jwt.sign(
        {
          contact: contactNo,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "24h",
        }
      );
      return token;
    }).then(result =>{
      res.status(201).json({
        otp: OTP,
        token: result,
        expiresIn: 3600*24,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Internal Error ! Could not resolve the request",
        message1: "Incorrect phone Number! Could not send message",
        error: error,
      });
    });
};
/************* Sign Up user verify *******/
exports.verifySignUp = (req,res, next) =>{
  const otp = req.body.value;
  console.log(otp);
  const user = new User({
    phoneNo : CONTACT
  });
  if (OTP == otp) {
    user.save();
    res.status(201).json({
      result: true,
    });
  } else {
    res.status(500).json({
      message: "Otp Not Verified !"
    })
  }
};
// Verifying User's Otp via user-login 
exports.userVerify = (req, res, next) => {
  const otp = req.body.value;
  const OrigOtp = OTP;
  const contact = CONTACT;
  const user = new User({
    phoneNo : CONTACT
  });
  if (OrigOtp == otp) {
    res.status(201).json({
      result: true,
    });
  } else {
    res.status(500).json({
      message: "Otp Not Verified !"
    })
  }
};


/**************User Login Controller ********/
exports.loginUser = (req, res, next) => {
  const contactNo = req.body.contact;
  CONTACT = req.body.contact;
  User.findOne({
    phoneNo: contactNo,
  }).then((result) => {
      if (result) {
        console.log(result);
        generateOtp(contactNo).then((data) => {
          const otpSent = data;
          OTP = otpSent;
          const token = jwt.sign(
            {
              contact: contactNo,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "24h",
            }
          );
          res.status(200).json({
            otp: otpSent,
            token: token,
            expiresIn: 3600*24,
            userId:result._id
          });
        });
      } else {
        res.status(500).json({
          message: "user does not exist",
        });
      }
    })
    .catch((error) => {
      res.status(501).json({
        message: "user does not exist",
        error: error,
      });
    });
};
/*******************Get User Id *********/
exports.getUserId = (req,res,next)=>{
  try{
    const token= req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token,process.env.JWT_KEY);
    //  console.log(decodedToken);
    const contactNo = decodedToken.contact;
    User.find({
        'phoneNo' : contactNo
    }).then((result) => {
      res.status(201).json({
        userId:result[0]._id.toString()
      });
    }).catch(error =>{
      res.status(501).json({
        message : "something went wrong"
      })
        console.log(error);
    });
}catch(error){
    res.status(401).json({
        message:'Auth Failed'
    })
}
};

