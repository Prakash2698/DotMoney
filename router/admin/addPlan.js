var express = require("express"),
router = express.Router();
const admin = require("../../controller/admin/addPlan");


router.post("/plan",admin.plan);
router.get("/getUser",admin.getuser);
router.get("/getOneUser/:userId",admin.getOneUser);
router.get("/orderHistory",admin.orderHistory);


module.exports = router ;