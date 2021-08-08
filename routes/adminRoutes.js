const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/user');
const adminController = require('../controllers/admin');
const vegController= require('../controllers/vegPrices');
const adminCheck = require('../middleware/adminAuthCheck');

/********* Configuring Multer ******/
const MIME_TYPE_MAP ={
  'image/jpeg':'jpg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
destination: (req, file, cb) => {
  cb(null,"backend/images");
},
filename: (req, file, cb)=>{
  const name = file.originalname.toLowerCase().slice(5);
  const ext = MIME_TYPE_MAP[file.mimetype];

  cb(null,req.body.vegetable+ name + '-' + Date.now()+'.'+ext);
}
});
router.post("/adminAuth",adminController.adminAuthentication);

router.get("/admin-prices",adminCheck,vegController.getPrices);

router.post("/addVeggies",multer({storage:storage}).single("image") ,adminController.addVeggies);

router.get("/getSingleVeg", adminController.getSingleVeg);

router.post("/updatePrices",multer({storage : storage}).single("image"), adminController.updatePrices);

router.post("/delete-bucket",adminController.deleteBucket);

router.post("/delete-veg",adminController.deleteVeg);

module.exports=router;