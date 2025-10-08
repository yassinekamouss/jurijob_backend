const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Candidat = require("../models/Candidat");
const Recruteur = require("../models/Recruteur");
const jwt = require("jsonwebtoken");

const generateTokens = require("../utils/generateTokens");

exports.loginUser = async (email, password) => {
  // Vérifier l'utilisateur
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Email ou mot de passe incorrect");
  }

  //  Générer les tokens
  const { accessToken, refreshToken } = generateTokens(user);

  //  Charger les infos supplémentaires selon le rôle
  let userData = user.toObject(); // copie propre du user mongoose

  if (user.role === "candidat") {
    const candidat = await Candidat.findOne({ userId: user._id }).lean();
    if (candidat) {
      userData = { ...userData, ...candidat }; // fusionner les deux objets
    }
  }

  if (user.role === "recruteur") {
    const recruteur = await Recruteur.findOne({ userId: user._id }).lean();
    if (recruteur) {
      userData = { ...userData, ...recruteur };
    }
  }

  //  Nettoyer les données (supprimer le password)
  delete userData.password;
  delete userData.__v;
  delete userData.createdAt;
  delete userData.updatedAt;
  //  Retourner la réponse complète
  return {
    user: userData,
    accessToken,
    refreshToken,
  };
};




exports.getCurrentUser = async (token) => {
  //  Vérifier le token
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  //  Trouver l'utilisateur
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  // Récupérer les infos supplémentaires selon le rôle
  let userData = user.toObject();

  if (user.role === "candidat") {
    const candidat = await Candidat.findOne({ userId: user._id }).lean();
    if (candidat) {
      userData = { ...userData, ...candidat };
    }
  }

  if (user.role === "recruteur") {
    const recruteur = await Recruteur.findOne({ userId: user._id }).lean();
    if (recruteur) {
      userData = { ...userData, ...recruteur };
    }
  }
  delete userData.__v;
  delete userData.createdAt;
  delete userData.updatedAt;

  //  Retourner le user complet
  return userData;
};