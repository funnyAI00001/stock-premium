const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
  },

  sector: {
    type: String,
  },

  industry: {
    type: String,
  },

  marketCap: {
    type: Number,
  },

  sharePrice: {
    type: Number,
  },

  beta: {
    type: Number,
  },

  name: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Stock", stockSchema);
