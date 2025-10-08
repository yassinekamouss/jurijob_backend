const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" } // court (15 minutes)
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // long (7 days)
  );

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
