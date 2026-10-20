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

  created_at: {
    type: Date,
    default: Date.now(),
  },

  type: {
    type: String,
    default: 'Free'
  }
});

module.exports = mongoose.model("User", userSchema);
