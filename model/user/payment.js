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
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['failed', 'confirmed'], // Correct 'sucess' to 'success'
        default: 'failed',
    }
});

module.exports = mongoose.model("payment", PaymentSchema);
