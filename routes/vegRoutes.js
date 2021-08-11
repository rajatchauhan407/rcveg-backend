const express= require('express');
const router = express.Router();
const vegController= require('../controllers/vegPrices');
const checkAuth = require('../middleware/auth-check');

router.get("/check",vegController.check);
router.post("/prices",vegController.prices);

router.get("/prices",checkAuth,vegController.getPrices);

router.post("/bucket",vegController.addVegBucket);

router.get("/orders",vegController.getOrders);

router.post("/orders/confirmOrder", vegController.confirmOrder);

router.get("/orders/getInvoice", vegController.getInvoice);

router.get("/bucket",vegController.getVegBucket);

router.delete("/bucket/delete", vegController.bucketDelete);


module.exports=router;