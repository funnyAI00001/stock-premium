const mongoose = require("mongoose");

const symbolListSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  }
});

module.exports = mongoose.model('SymbolList', symbolListSchema)
