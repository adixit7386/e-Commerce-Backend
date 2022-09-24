const Joi = require("joi");
const RefreshToken = require("../models/refreshToken");

const logoutController = async (req, res, next) => {
  //validation
  const refreshSchema = Joi.object({
    refreshToken: Joi.string().required(),
  });

  const { error } = refreshSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  try {
    await RefreshToken.deleteOne({ refreshToken: req.body.refreshToken });
  } catch (error) {
    return next(error);
  }
  res.send("logged out");
};
module.exports = logoutController;
