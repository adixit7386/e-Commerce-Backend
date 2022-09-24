const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer" },
  },
  { timeStamps: true }
);

module.exports = new mongoose.model("User", User);
