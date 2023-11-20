const mongoose = require("mongoose");
bcrypt = require('bcrypt');
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    mobileNo: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
       type:String,
       required:true
    },    
    token:{
        type:String
    },
    created: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model("admin", adminSchema);
