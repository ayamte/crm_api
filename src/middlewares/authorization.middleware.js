const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || typeof authorization !== 'string') {
    return res.status(403).json({ message: "Forbidden: Invalid token format" });
  }

  try {
    // 1. Verify if JWT is valid
    const decoded = await verifyAccessJWT(authorization);
    console.log(decoded);

    if (decoded.email) {
      const userId = await getJWT(authorization);

      if (!userId) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      req.userId = userId;
      return next();
    } 

    // If the token is invalid, delete it from Redis
    await deleteJWT(authorization);
    return res.status(403).json({ message: "Forbidden: Invalid token" });

  } catch (error) {
    console.error("Error in userAuthorization middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  userAuthorization,
};
