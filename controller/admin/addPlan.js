const plan = require('../../model/admin/addPlan');
const getUser = require('../../model/user/Register')
const orderHistory = require('../../model/user/order');
const mongoose = require("mongoose");


module.exports = {
    plan: async (req, res) => {
        try {
            const { title, provider, amount, description } = req.body;
            const add_plan = new plan({
                title,
                provider,
                amount,
                description
            })
            add_plan.save();
            if (!add_plan) {
                res.send({ status: 400, message: "plan not added" });
            }
            res.send({ status: 200, message: "plan added successfuly", result: add_plan });

        } catch (error) {

        }
    },

    // ============== update plan ===============================
    updatePlan: async (req, res) => {
        try {
            const planId = req.params._id ;
          const { title, provider, amount, description } = req.body;      
          // Find the plan by its ID
          const foundPlan = await plan.findById(planId);
      
          if (!foundPlan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
          }
      
          // Update the plan properties
          foundPlan.title = title || foundPlan.title;
          foundPlan.provider = provider || foundPlan.provider;
          foundPlan.amount = amount || foundPlan.amount;
          foundPlan.description = description || foundPlan.description;      
          // Save the updated plan
          const updatedPlan = await foundPlan.save();
      
          res.status(200).json({ success: true, message: "Plan updated successfully", result: updatedPlan });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: "Something went wrong" });
        }
      },

// ===================== delete plan =========================
deletePlan: async (req, res) => {
    try {
      const planId = req.params._id; // Fetch the plan ID from URL parameters
//   console.log(planId);
      // Find the plan by its ID
      const foundPlan = await plan.findById(planId);
  
      if (!foundPlan) {
        return res.status(404).json({ success: false, message: "Plan not found" });
      }
  
      // Delete the plan
      await plan.findByIdAndDelete(planId);
  
      res.status(200).json({ success: true, message: "Plan deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },

    getuser: async (req, res) => {
        const allUser = await getUser.find();
        if (!allUser) {
            res.send({ message: "user not found" })
        }
        res.send({ result: allUser });
    },

    getOneUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await getUser.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user); // Send the user details as JSON response
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    orderHistory: async (req, res) => {
        try {
            const orderGet = await orderHistory.find();
            if (!orderGet) {
                res.send({ status: 402, message: "order_not_found" })
            }
            res.send({ message: "sucess", result: orderGet });
        } catch (error) {
            console.log(error);
        }
    }


}