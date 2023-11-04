var express = require("express"),
router = express.Router();
const admin = require("../../controller/admin/addPlan");
const authToken = require("../../middlewar/auth");

router.post("/plan",authToken,admin.plan);
router.get("/getUser",authToken,admin.getuser);
router.get("/getOneUser/:userId",admin.getOneUser);
router.get("/orderHistory",authToken,admin.orderHistory);


module.exports = router ;