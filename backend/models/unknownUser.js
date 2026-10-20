const mongoose = require("mongoose");

const unknownUserSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
  },

  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("UnknownUser", unknownUserSchema);
