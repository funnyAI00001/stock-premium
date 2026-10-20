const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  user_email: { type: String },
  symbols: { type: [String], default: [] },
});

module.exports = mongoose.model("category", categorySchema);
