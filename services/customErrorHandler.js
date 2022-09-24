class customErrorHandler extends Error {
  constructor(statusCode, msg) {
    super();
    this.status = statusCode;
    this.message = msg;
  }

  static alreadyExist(message) {
    return new customErrorHandler(409, message);
  }
  static wrongCredentials(message) {
    return new customErrorHandler(409, message);
  }
  static unAuthorized(message) {
    return new customErrorHandler(401, message);
  }
  static notFound(message) {
    return new customErrorHandler(404, message);
  }
  static serverError(message) {
    return new customErrorHandler(500, message);
  }
}

module.exports = customErrorHandler;
