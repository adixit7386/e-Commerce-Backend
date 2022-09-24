const customErrorHandler = require("../services/customErrorHandler");
const JwtService = require("../services/JwtService");
const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(customErrorHandler.unAuthorized("invalid token"));
  }
  let token = authHeader.split(" ")[1];

  try {
    // const { _id, role } = await JwtService.verify(token);
    // const { _id, role } = await JwtService.verify(token);

    const { _id, role } = await JwtService.verify(token);
    const result = {
      _id,
      role,
    };

    req.user = result;

    next();
  } catch (error) {
    console.log("jwt error");
    return next(customErrorHandler.unAuthorized("invalid token"));
  }
};

module.exports = auth;
