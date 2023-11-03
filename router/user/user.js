const express = require("express");
router = express.Router();
const userController = require('../../controller/user/user');

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const authToken = require("../../middlewar/auth");


router.post("/register",upload.fields([{ name: 'aadhaarImage', maxCount: 1 },{ name: 'panImage', maxCount: 1 },{ name: 'voterCard', maxCount: 1 },{ name: 'drvingLicence', maxCount: 1 },{ name: 'other', maxCount: 1 },]),userController.Register);

router.post("/otpSend",userController.otpSend);
router.post("/login/:mobileNo",userController.login);
router.post("/resendOTP/:mobileNo", userController.resendOTP);
// router.post("/user_login",userController.user_login);
router.get("/getPlan",userController.getPlan);
router.post("/orderPlan",authToken,userController.orderPlan);




module.exports = router ;