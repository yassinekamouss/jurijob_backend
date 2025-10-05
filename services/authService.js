const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateTokens = require("../utils/generateTokens");

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  return {
    user: {
      id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};
