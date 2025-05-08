const mongoose = require("mongoose");
  async function  connect() {
  try {
   
    await mongoose.connect(process.env.mongourl);

    console.log("data base is connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connect;
