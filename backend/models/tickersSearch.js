const mongoose = require("mongoose");

const tickersSearchSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },

  userType: {
    type: String,
    required: true,
  },

  userEmail: {
    type: String,
    required: true,
  },

  count: {
    type: Number,
    default: 1,
  },

  date: {
    // CST
    type: Date,
    default: Date.now,
  },  
});

module.exports = mongoose.model("TickersSearch", tickersSearchSchema);
