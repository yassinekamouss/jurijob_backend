const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function createUser(data) {
  const { nom, prenom, email, password, telephone, role } = data;

  // Vérifier si l'email existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email déjà utilisé");
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    nom,
    prenom,
    telephone,
    email,
    password: hashedPassword,
    role,
  });

  return await user.save();
}

async function findUserById(userId) {
  return await User.findById(userId);
}

module.exports = { createUser, findUserById };
