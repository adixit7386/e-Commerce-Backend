const Joi = require("joi");
const customErrorHandler = require("../services/customErrorHandler");
const RefreshToken = require("../models/refreshToken");
const JwtService = require("../services/JwtService");
const dotenv = require("dotenv");
const User = require("../models/user");
dotenv.config();

const refreshController = async (req, res, next) => {
  //validation
  const refreshSchema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  const { error } = refreshSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  //check in the database
  let refresh_token;
  try {
    refresh_token = await RefreshToken.findOne(req.body);
    if (!refresh_token) {
      return next(customErrorHandler.unAuthorized("invalid token"));
    }
  } catch (error) {
    return next("something went wrong " + error);
  }

  //verify the token
  let userId;
  try {
    const { _id, role } = await JwtService.verify(
      req.body.refreshToken,
      process.env.REFRESH_SECRET
    );
    userId = _id;
  } catch (error) {
    return next(customErrorHandler.unAuthorized("invalid token"));
  }
  //search in the database
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return next(customErrorHandler.unAuthorized("no user found "));
    }
    //generate tokens
    accessToken = JwtService.sign({ _id: user._id, role: user.role });
    refreshToken = await JwtService.sign(
      { _id: user._id, role: user.role },
      process.env.REFRESH_SECRET,
      "1y"
    );
  } catch (error) {
    return next(error);
  }
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
};

module.exports = refreshController;
