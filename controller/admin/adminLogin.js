const admin = require('../../model/admin/signup');
const helper = require('../../helper/common');

module.exports = {
    signup: async (req, res) => {
        try {
            const { name, mobileNo, email, password } = req.body;

            // Validate that mobileNo is not empty and has at most ten digits
            if (!mobileNo || !/^\d{10}$/.test(mobileNo)) {
                return res.status(400).send({ success: false, msg: "Invalid mobileNo" });
            }
            // Check if the mobileNo already exists in the database
            const adminData = await admin.findOne({ mobileNo: mobileNo });
            if (adminData) {
                return res.status(201).send({ success: false, msg: "mobileNo already exists" });
            }
            const signup = new admin({
                name,
                mobileNo,
                email,
                password
            });

            const adminResult = await signup.save();
            res.status(200).send({ success: true, data: adminResult });

        } catch (error) {
            console.log(error);
            res.status(400).send({ status: 400, message: error.message });
        }
    },

    admin_login: async (req, res) => {
    try {
        const { mobileNo, password } = req.body;
        if (!mobileNo || !password) {
            return res.status(400).json({ success: false, message: "Both mobileNo and password are required" });
        }
        // Find the admin user in the database by mobileNo
        const adminR = await admin.findOne({ mobileNo });         
        if (!adminR) {
            return res.status(401).json({ success: false, message: "Admin not found" });
        }
        const { _id } = adminR; // Access _id from the found admin document
        const token = helper.createJwtToken({ _id });
        
        // Update the token field in the admin document
        adminR.token = token;
        await adminR.save(); // Save the updated admin document
        
        res.status(200).json({ success: true, message: "Login successful", result: adminR });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

}