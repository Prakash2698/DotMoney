const usermodel = require("../../model/user/Register");
const bcrypt = require("bcrypt"); // Import the bcrypt library
const helper = require('../../helper/common');
const OtpModel = require("../../model/user/otp");
const order = require('../../model/user/order');
const plan = require('../../model/admin/addPlan');
const Razorpay = require('razorpay');
const paymentModel = require("../../model/user/payment");

module.exports = {
    // Register: async (req, res) => {
    //     try {
    //         const { name, mobileNo, DOB, GST_Number } = req.body;
    //         // const { aadhaarImage, panImage, voterCard, drvingLicence, other } = req.files;
    //         const aadhaarImage = req.files.aadhaarImage[0].path;
    //         console.log(req.files);
    //         const panImage = req.files.panImage[0].path;
    //         const voterCard = req.files.voterCard[0].path;
    //         const drvingLicence = req.files.drvingLicence[0].path;
    //         const other = req.files.other[0].path;

    //         // Validate that mobileNo is not empty and has at most ten digits
    //         if (!mobileNo || !/^\d{10,10}$/.test(mobileNo)) {
    //             res.status(400).send({ success: false, msg: "Invalid mobileNo" });
    //             return;
    //         }
    //         if (!mobileNo) {
    //             res.status(400).send({ success: false, msg: "mobileNo is required" });
    //             return;
    //         }
    //         // Check if the mobileNo already exists in the database
    //         const userData = await usermodel.findOne({ mobileNo: mobileNo });
    //         if (userData) {
    //             res.status(201).send({ success: false, msg: "mobileNo already exists" });
    //             return;
    //         }
    //         const Register = new usermodel({
    //             name,
    //             mobileNo,
    //             DOB,
    //             GST_Number,
    //             document: {
    //                 aadhaarImage,
    //                 panImage,
    //                 voterCard,
    //                 drvingLicence,
    //                 other
    //             }
    //         });
    //         const user = await Register.save();
    //         res.status(200).send({ success: true, data: user });

    //     } catch (error) {
    //         console.log(error);
    //         res.status(400).send({ status: 400, message: error.message });
    //     }
    // },

    Register: async (req, res) => {
        try {
            const { name, mobileNo, DOB, documentNo } = req.body;

            // Check if there are any image files uploaded
            if (!req.files ||
                (!req.files.aadhaarImage && !req.files.panImage && !req.files.voterCard && !req.files.drvingLicence && !req.files.other)) {
                return res.status(400).send({ success: false, msg: "At least one image is required" });
            }

            // Validate that mobileNo is not empty and has at most ten digits
            if (!mobileNo || !/^\d{10}$/.test(mobileNo)) {
                return res.status(400).send({ success: false, msg: "Invalid mobileNo" });
            }

            // Check if the mobileNo already exists in the database
            const userData = await usermodel.findOne({ mobileNo: mobileNo });
            if (userData) {
                return res.status(201).send({ success: false, msg: "mobileNo already exists" });
            }

            const Register = new usermodel({
                name,
                mobileNo,
                DOB,
                documentNo,
                document: {
                    aadhaarImage: req.files.aadhaarImage ? req.files.aadhaarImage[0].path : null,
                    panImage: req.files.panImage ? req.files.panImage[0].path : null,
                    voterCard: req.files.voterCard ? req.files.voterCard[0].path : null,
                    drvingLicence: req.files.drvingLicence ? req.files.drvingLicence[0].path : null,
                    other: req.files.other ? req.files.other[0].path : null
                }
            });

            const user = await Register.save();
            res.status(200).send({ success: true, data: user });

        } catch (error) {
            console.log(error);
            res.status(400).send({ status: 400, message: error.message });
        }
    },

    otpSend: async (req, res) => {   // otp send on number
        try {
            const mobileNo = req.body.mobileNo;
            const user = await usermodel.findOne({ mobileNo: mobileNo });
            if (!user) {
                return res.status(401).json({ message: 'please check your number' });
            }
            const otp = helper.otpGenerate();
            const otpS = new OtpModel({
                mobileNo,
                otp
            });
            // Send OTP to the mobile number using MSG91
            const otpSent = await helper.generateOtpWithMSG91({ mobileNo, otp });

            console.log("OTP send on phone number>>>", otpSent);
            const Otp = await otpS.save();
            res.send({ status: 200, message: "sucess", Otp })

        } catch (error) {
            console.log(">>>>>>>>>>>>>>..", error);
            res.status(500).send("somethings went wrong");
        }
    },

    // verifyotp: async (req, res) => {
    login: async (req, res) => {
        try {
            const mobileNo = req.params.mobileNo;
            const otp = req.body.otp;
            console.log(req.body, req.params);
            const findotp = await OtpModel.findOne({ otp: otp, mobileNo: mobileNo });
            console.log(findotp);
            if (!findotp) {
                return res.status(401).json({ message: 'otp_not_found' });
            }
            await helper.updateVerifyOtp({ _id: findotp._id }, { $set: { isVerify: true } })
            const user = await usermodel.findOne({ mobileNo: req.params.mobileNo })
            if (!user) {
                res.send({ message: "User not found" });
            }
            const { _id } = user
            const token = helper.createJwtToken({ _id });
            user.token = token;
            user.save()
            // res.send({ message: "Otp verify successfully", token: token });
            res.send({ message: "Otp verify successfully", user });
        } catch (error) {
            console.log(error);
            res.send({ message: "not_found" });
        }
    },

    resendOTP: async (req, res) => {
        try {
            const mobileNo = req.params.mobileNo;
            const user = await OtpModel.findOne({ mobileNo: mobileNo });
            if (!user) {
                res.send({ status: 401, message: "number Not Found" });
            }
            const otp = helper.otpGenerate();
            const otpS = new OtpModel({
                mobileNo,
                otp
            });
            const otpSent = await helper.generateOtpWithMSG91({ mobileNo, otp });
            console.log("OTP send on phone number>>>", otpSent);
            const Otp = await otpS.save();
            res.send({ status: 200, message: "sucess", Otp })
        } catch (error) {
            console.log(error);
            res.send({ status: 400, message: "Some error in accessing user data" });
        }
    },

    getPlan: async (req, res) => {
        try {
            const planget = await plan.find();
            if (!planget) {
                res.send({ message: "plan not found" })
            }
            res.send({ result: planget });
        } catch (error) {
            console.log(error);
        }
    },

    // user_login: async (req, res) => {
    //     try {
    //         const { mobileNo, password } = req.body;
    //         if (!mobileNo || !password) {
    //             return res.status(400).json({ success: false, message: "Both mobileNo and password are required" });
    //         }
    //         // Find the user in the database by partnerId
    //         const user = await usermodel.findOne({ mobileNo });
    //         console.log(user);
    //         if (!user) {
    //             return res.status(401).json({ success: false, message: "User not found" });
    //         }
    //         // Compare the provided password with the hashed password in the database
    //         const passwordMatch = await bcrypt.compare(password, user.password);
    //         if (!passwordMatch) {
    //             return res.status(401).json({ success: false, message: "Incorrect password" });
    //         }
    //         const { _id } = user
    //         const token = helper.createJwtToken({ _id });
    //         user.token = token;
    //         user.save()

    //         res.status(200).json({ success: true, message: "Login successful", result: user });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ success: false, message: "Something went wrong" });
    //     }
    // }
    // orderPlan: async(req,res)=>{
    //     const {userId, planId ,quantity } = req.body;
    //     const planO = await plan.findById(planId);      
    //     if (!planO) {
    //       return res.status(404).json({ message: "planId not found" });
    //     }      
    //     // Calculate total price
    //     const totalPrice = plan.amount * quantity;

    //     // const totalPrice = plan.amount * quantity;  
    //     const orderplan = new order({
    //         userId,
    //         planId,
    //         quantity,
    //         totalPrice,
    //       });      
    //       const savedOrder = await orderplan.save();
    //       res.status(201).json(savedOrder);
    // }

    orderPlan: async (req, res) => {
        try {
            const { userId, planId, quantity } = req.body;
            const planO = await plan.findById(planId);
            if (!planO) {
                return res.status(404).json({ message: "planId not found" });
            }
            // Validate that plan.amount is a valid number and quantity is a positive integer
            if (typeof planO.amount !== 'number' || isNaN(planO.amount) || quantity <= 0 || !Number.isInteger(quantity)) {
                return res.status(400).json({ message: "Invalid input for plan amount or quantity" });
            }
            // Calculate total price
            const totalPrice = planO.amount * quantity;
            const orderplan = new order({
                userId,
                planId,
                quantity,
                totalPrice,
            });
            const savedOrder = await orderplan.save();
            res.status(201).json(savedOrder);

        } catch (error) {
            console.log(error);
        }
    },


    create_orderId: async (req, res) => {
        try {
            const { amount, description } = req.body;

            var options = {
                amount: amount * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "rcp1"
            };
            const instance = new Razorpay({
                key_id: 'rzp_test_AOjY52pvdqhUEh',
                key_secret: 'tB1CHTW3BvEb9TR06ILUCBWV',
            })
            const order = await instance.orders.create(options)
            const payment = new paymentModel({
                orderId: order.id,
                amount: amount,
                description: description,
            });
            const savedPayment = await payment.save();
            res.status(200).json({
                message: "Payment created",
                payment: savedPayment,
                razorpayOrder: order,
            });

        } catch (error) {
            console.log(error);
        }
    },
    
payment_vefify : async(req,res)=>{

    try {
        const { paymentId, orderId } = req.body;
        // Find the payment using razorpay_order_id
        const payment = await paymentModel.findOne({ paymentId });
        //   console.log(">>>>>>>>>",payment);

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        // Update the payment status to "confirmed"
        payment.status = 'confirmed';
        await payment.save();
        const order = await order_ProductModel.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ error: 'order not found' });
        }
        order.status = 'sucess';
        await order.save();

        res.status(200).json({ message: 'payment_confirmed and order sucess' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
},


    // razorpay_create_payment: async (req, res) => {
    //     try {
    //         const { amount, description } = req.body;
    //         // Create a Razorpay order
    //         const options = {
    //             amount: amount * 100, // Amount in paise (1 INR = 100 paise)
    //             currency: "INR",
    //             payment_capture: 1, // Auto-capture payment
    //         };
    //         const order = await Razorpay.orders.create(options);
    //         const payment = new paymentModel({
    //             orderId: order.id,
    //             amount: amount,
    //             description: description,
    //         });
    //         const savedPayment = await payment.save();
    //         res.status(200).json({
    //             message: "Payment created",
    //             payment: savedPayment,
    //             razorpayOrder: order,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ error: "An error occurred" });
    //     }
    // },
    // ======================= confirm product payment ============================
    payment_callback: async (req, res) => {
        try {
            const { paymentId, orderId } = req.body;
            // Find the payment using razorpay_order_id
            const payment = await paymentModel.findOne({ paymentId });
            //   console.log(">>>>>>>>>",payment);

            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            // Update the payment status to "confirmed"
            payment.status = 'confirmed';
            await payment.save();
            const order = await order_ProductModel.findOne({ orderId });
            if (!order) {
                return res.status(404).json({ error: 'order not found' });
            }
            order.status = 'sucess';
            await order.save();

            res.status(200).json({ message: 'payment_confirmed and order sucess' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        }
    }


}

