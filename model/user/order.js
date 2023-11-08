const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: { // Add a field for the user ID
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    orderId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true, 
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId, ref: "plan"
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending','failed', 'confirmed'],
        default: 'pending',
    }
});

module.exports = mongoose.model("order", PaymentSchema);
