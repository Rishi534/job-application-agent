
const jwt = require("jsonwebtoken");

function verifyUserToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token is required"
    });
  }

  const loginToken = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(
      loginToken,
      process.env.JWT_SECRET
    );

    req.user = {
      userId: decodedToken.userId
    };

    next();
  } catch (tokenError) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports = verifyUserToken;
