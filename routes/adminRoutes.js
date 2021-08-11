var aws = require('aws-sdk');
const express = require('express');
var multer = require('multer');
var multerS3 = require('multer-s3');
const router = express.Router();
const userController = require('../controllers/user');
const adminController = require('../controllers/admin');
const vegController= require('../controllers/vegPrices');
const adminCheck = require('../middleware/adminAuthCheck');


const dotenv = require('dotenv');
dotenv.config();
// console.log(process.env.AuthId)
// Configuring AWS
// AWS.config.loadFromPath('./nodemon.json');
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region:'ap-south-1'
});
// console.log(process.env.AWS_ACCESS_KEY_ID);
const s3 = new aws.S3();
/********* Configuring Multer ******/
const MIME_TYPE_MAP ={
  'image/jpeg':'jpg',
  'image/jpg': 'jpg'
};

const upload = multer({
  storage:multerS3(
    {
      s3: s3,
      bucket: 'veggies-images',
      fileFilter: (res, file, callback) => {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            res.status(400).send('Only images are allowed')
        }
        callback(null, true);
    },
      acl:'public-read',
      ContentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const name = file.originalname.toLowerCase().slice(5);
        const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null,req.body.vegetable + name + '-' + Date.now()+'.'+ext);
      }
    }
  )
});

// const storage = multer.diskStorage({
// destination: (req, file, cb) => {
//   cb(null,"backend/images");
// },
// filename: (req, file, cb)=>{
//   const name = file.originalname.toLowerCase().slice(5);
//   const ext = MIME_TYPE_MAP[file.mimetype];

//   cb(null,req.body.vegetable+ name + '-' + Date.now()+'.'+ext);
// }
// });
router.post("/adminAuth",adminController.adminAuthentication);

router.get("/admin-prices",adminCheck,vegController.getPrices);

router.post("/addVeggies",upload.single("image"),adminController.addVeggies);

router.get("/getSingleVeg", adminController.getSingleVeg);

router.post("/updatePrices",upload.single("image"), adminController.updatePrices);

router.post("/delete-bucket",adminController.deleteBucket);

router.post("/delete-veg",adminController.deleteVeg);

module.exports=router;