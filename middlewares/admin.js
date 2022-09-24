const User = require("../models/user");
const customErrorHandler = require("../services/customErrorHandler.js");

const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (user.role === "admin") {
      next();
    } else {
      return next(customErrorHandler.unAuthorized("user unauthorized"));
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = admin;
