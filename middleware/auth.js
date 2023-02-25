const jwt = require("jsonwebtoken");
const https = require("https");
const { sendCustomError } = require("../utils/errors");

const verifyToken = (req, res, next, requiredRole) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")?.[1];

    req.token = bearerToken;

    try {
      const decoded = jwt.verify(bearerToken, `${process.env.JWT_SECRET}`);
      req.user = decoded;
      if (decoded.role !== requiredRole && decoded.role !== "admin")
        return sendCustomError(
          res,
          401,
          "Insufficient permission to access this endpoint"
        );
      next();
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        sendCustomError(res, 401, "Token has expired");
      } else sendCustomError(res, 401, "Token is invalid");
    }
  } else {
    sendCustomError(res, 401, "Authorization token not found");
  }
};

const verifyAdminToken = (req, res, next) => {
  verifyToken(req, res, next, "admin");
};

const verifyUserToken = (req, res, next) => {
  verifyToken(req, res, next, "user");
};

module.exports = {
  verifyAdminToken,
  verifyUserToken,
};
