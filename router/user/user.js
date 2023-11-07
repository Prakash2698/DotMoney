const express = require("express");
router = express.Router();
const userController = require('../../controller/user/user');

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const authToken = require("../../middlewar/auth");


router.post("/register",upload.fields([{ name: 'aadhaarImage' },{ name: 'panImage'},{ name: 'voterCard' },{ name: 'drvingLicence'},{ name: 'other'},]),userController.Register);

router.post("/otpSend",userController.otpSend);
router.post("/login/:mobileNo",userController.login);
router.post("/resendOTP/:mobileNo", userController.resendOTP);
// router.post("/user_login",userController.user_login);
router.get("/getPlan",userController.getPlan);
router.post("/orderPlan",authToken,userController.orderPlan);
router.post("/create_orderId",authToken,userController.create_orderId);




module.exports = router ;