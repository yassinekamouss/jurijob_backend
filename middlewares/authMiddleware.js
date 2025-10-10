const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer xxx"

  if (!token) {
    return res.status(401).json({ message: "Token d'accès manquant" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide ou expiré" });
    }

    req.userId = user.id;
    next();
  });
}

module.exports = authenticateToken;
