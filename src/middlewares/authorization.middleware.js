const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || typeof authorization !== 'string') {
    return res.status(403).json({ message: "Forbidden: Invalid token format" });
  }

  const token = authorization.split(' ')[1];

  
  if (!token) {
    return res.status(403).json({ message: "Forbidden: No token provided" });
  }

  try {
    // 1. Verify if JWT is valid
    //const decoded = await verifyAccessJWT(authorization);
    const decoded = await verifyAccessJWT(token);
    //console.log(decoded);
    console.log("Token li decoda:", decoded);

    if (decoded.email) {
      //const userId = await getJWT(authorization);
      const userId = await getJWT(token);

      if (!userId) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      req.userId = userId;
      return next();
    } 

    // If the token is invalid, delete it from Redis
    //await deleteJWT(authorization);
    await deleteJWT(token);
    return res.status(403).json({ message: "Forbidden: Invalid token" });

  } catch (error) {
    console.error("Error in userAuthorization middleware:", error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  userAuthorization,
};