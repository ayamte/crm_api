const jwt = require("jsonwebtoken");

const createAccessJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { payload },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

const createRefreshJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { payload },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  createAccessJWT,
  createRefreshJWT,
};
