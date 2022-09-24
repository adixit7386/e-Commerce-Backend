const mongoose = require("mongoose");

const refreshSchema = mongoose.Schema({
  refreshToken: { type: String, required: true },
});

module.exports = new mongoose.model("RefreshToken", refreshSchema);
