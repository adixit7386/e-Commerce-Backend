const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const JwtService = require("../services/JwtService");
const customErrorHandler = require("../services/customErrorHandler");
const RefreshToken = require("../models/refreshToken");
const dotenv = require("dotenv");

dotenv.config();
const loginController = async (req, res, next) => {
  //Create a Schema

  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  //validation
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  //check if user already exists in the database
  let accessToken;
  let refreshToken;

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(customErrorHandler.wrongCredentials("user doesn't exist"));
    }

    //compare the password
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return next(customErrorHandler.wrongCredentials("user doesn't exist"));
    }
    accessToken = JwtService.sign({ _id: user._id, role: user.role });
    refreshToken = await JwtService.sign(
      { _id: user._id, role: user.role },
      process.env.REFRESH_SECRET,
      "1y"
    );

    await RefreshToken.create({ refreshToken: refreshToken });
  } catch (error) {
    return next(error);
  }
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
};
module.exports = loginController;
