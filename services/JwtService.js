const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

class JwtService {
  static sign(payload, secret = process.env.SECRET, expiry = "1y") {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }
  static verify(payload, secret = process.env.SECRET) {
    return jwt.verify(payload, secret);
  }
}

module.exports = JwtService;
