const mongoose = require("mongoose");
bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
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
    DOB: {
        type: Date,
        required: true
    },
    document: {
        aadhaarImage: {    // image
            type: String,
        },
        panImage: {   // image
            type: String,
        },
        voterCard: {  // image
            type: String
        },
        drvingLicence: {   // image
            type: String
        },
        other: {    // image
            type: String,
        }
    },
    GST_Number:{
       type:String
    },
    token:{
        type:String
    },
    created: {
        type: Date,
        default: Date.now
    },

});
// userSchema.methods.comparePassword = function (password) {
//     return bcrypt.compareSync(password, this.hash_password);
// };

module.exports = mongoose.model("user", userSchema);
