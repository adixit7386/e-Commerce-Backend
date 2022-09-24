const Joi = require("joi");
const customErrorHandler = require("../services/customErrorHandler");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const JwtService = require("../services/JwtService");
const RefreshToken = require("../models/refreshToken");
const dotenv = require("dotenv");

dotenv.config();
const registerController = async (req, res, next) => {
  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    repeat_password: Joi.ref("password"),
  });

  //validation
  const { error } = registerSchema.validate(req.body);

  if (error) {
    console.log(error);
    return next(error);
  }
  console.log(req.body);

  //check if the user exists in the database already

  try {
    const exist = await User.exists({ email: req.body.email });
    if (exist) {
      return next(customErrorHandler.alreadyExist("this email already exixt"));
    }
  } catch (error) {
    return next(error);
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  let accessToken;
  let refreshToken;
  try {
    const result = await user.save();
    console.log(result);

    accessToken = await JwtService.sign({ _id: result._id, role: result.role });
    refreshToken = await JwtService.sign(
      { _id: result._id, role: result.role },
      process.env.REFRESH_SECRET,
      "1y"
    );
    //database whitelist
    await RefreshToken.create({
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log("this error");
    return next(error);
  }

  res.send({ accessToken: accessToken, refreshToken: refreshToken });
};

module.exports = registerController;
