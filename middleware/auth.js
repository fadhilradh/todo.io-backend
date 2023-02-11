const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          message: "You are unauthorized to access this page (unknown error)",
        });
      } else {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({
            message: "You are unauthorized to access this page. Wrong role",
          });
        } else {
          next();
        }
      }
    });
  } else {
    return res.status(401).json({
      message: "You are unauthorized to access this page. Token not available",
    });
  }
};

const userAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "You are unauthorized to access this page" });
      } else {
        if (!["admin", "user"].includes(decodedToken.role)) {
          return res
            .status(401)
            .json({ message: "You are unauthorized to access this page" });
        } else {
          next();
        }
      }
    });
  } else {
    return res.status(401).json({
      message:
        "You are unauthorized to access this page. Token not available or invalid",
    });
  }
};

module.exports = {
  adminAuth,
};
