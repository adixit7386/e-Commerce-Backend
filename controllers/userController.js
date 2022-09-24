const User = require("../models/user");
const customErrorHandler = require("../services/customErrorHandler");

const userController = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select(
      "-password -role -__v -_id"
    );
    if (!user) {
      return next(customErrorHandler.notFound("user not found"));
    }
    // console.log(user);
    // res.send("done");
    res.json(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = userController;
