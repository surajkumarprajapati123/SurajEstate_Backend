const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { UserService } = require("../Service");

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.headers.authorization ||
      req.cookies.access_token;

    if (!token) return next(new ApiError(401, "Unauthorized"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(new ApiError(403, "Forbidden"));

      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
