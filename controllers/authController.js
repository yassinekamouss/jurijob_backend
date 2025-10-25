const { loginUser , getCurrentUser } = require("../services/authService");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    const isProd = process.env.NODE_ENV === "production";
    // Définir le refresh token dans un cookie HTTPOnly sécurisé
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd, // HTTPS en prod
      sameSite: isProd? "Strict" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.status(200).json({
      message: "Connexion réussie",
      user,
      accessToken, // envoyé au frontend → stocké dans Redux
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

//  Rafraîchir le token d'accès
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ message: "Aucun refresh token fourni" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Refresh token invalide ou expiré" });
  }
};


// Déconnexion
exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Déconnexion réussie" });
};


// Récupérer l'utilisateur connecté
exports.me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const user = await getCurrentUser(token);
   

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: err.message || "Token invalide ou expiré" });
  }
};
