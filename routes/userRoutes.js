const express= require('express');
const router = express.Router();
const userController= require('../controllers/user');

const checkUser = require('../middleware/checkPhoneNumber');
const checkAuth= require('../middleware/auth-check');

// Creating a user and Otp verification
router.post("/signUp",checkUser,userController.createUser);

router.post("/login",userController.loginUser);

router.post("/verifyOtp", userController.userVerify);

router.post("/verifySignOtp", userController.verifySignUp);

router.get("/getId",userController.getUserId);




module.exports=router;
// chouhanakansha09@gmail.com