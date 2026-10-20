const mongoose = require("mongoose");

const expirationSchema = new mongoose.Schema({
  date: {
    type: String,
  },
});

module.exports = mongoose.model("Expiration", expirationSchema);
