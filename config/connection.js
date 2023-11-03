const mongoose = require('mongoose');
const mongodb= mongoose.connect("mongodb://0.0.0.0:27017/DOTMoney",{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  module.exports = mongodb;
