var express = require("express"),
router = express.Router();
const controller = require("../../controller/admin/adminLogin");


router.post("/adminSignup",controller.signup);
router.post("/adminLogin",controller.admin_login);  

module.exports = router ;
