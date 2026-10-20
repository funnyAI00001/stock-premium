const mongoose = require("mongoose");

const pageClickCountSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
  },

  clickCount: {
    type: Number,
    default: 1,
  },

  userType: {
    type: String,
  }
});

module.exports = mongoose.model("pageClickCount", pageClickCountSchema);
