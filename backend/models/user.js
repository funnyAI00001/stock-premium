const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  stripe: {
    type: Boolean,
    default: false,
  },
  
  checkout_session_id: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
