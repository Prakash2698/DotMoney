const mongoose = require('mongoose');

const url = "mongodb+srv://webersedigialifeapi:webersedigialifeapi@digialifeapipanel.5sgkx4e.mongodb.net/dotMoney";

// const url = "mongodb://0.0.0.0:27017/DOTMoney"
const mongodb= mongoose.connect(url,{
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
