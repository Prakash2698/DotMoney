const mongoose = require("mongoose");
const Addplan = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    provider: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        // default: false
        require:true
    },
    description:{
        type:String,
        require:true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("plan", Addplan);
