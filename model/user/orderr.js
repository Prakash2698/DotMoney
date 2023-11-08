const mongoose = require("mongoose");
bcrypt = require('bcrypt');
const order_product = new mongoose.Schema({

    userId: {
        // Reference to the user who placed the order
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    },
    // Reference to the plan in the order
    planId: {
        type: mongoose.Schema.Types.ObjectId, ref: "plan"
    },
    quantity: {
        type: Number,
    },
    totalPrice: Number,

    status: {
        type: String,
        enum: ['sucess', 'pending'],
        default: 'pending'
    },
    created: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("order", order_product);
