const User = require("../models/User");
const Candidat = require("../models/Candidat");
const Recruteur = require("../models/Recruteur");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinaryConfig");
const fs =require("fs");


async function createUser(data, imageFile) {
  const { nom, prenom, email, password, telephone, role } = data;

  // Vérifier si l'email existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email déjà utilisé");
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  let imageUrl = null;
      if (imageFile) {
        try {
          const result = await cloudinary.uploader.upload(imageFile.path, {
            folder: "imageProfile",
            use_filename: true,
            unique_filename: true
          });
          imageUrl = result.secure_url;
        } finally {
          fs.unlinkSync(imageFile.path);
        }
      }

  const user = new User({
    nom,
    prenom,
    telephone,
    email,
    password: hashedPassword,
    role,
    imageUrl,
  });

  return await user.save();
}

async function findUserById(userId) {
  return await User.findById(userId);
}



/**
 * Supprime un utilisateur et son profil associé
 */
async function deleteUserAndProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  // Supprimer le profil lié selon le rôle

  if (user.role === "candidat") {
    await Candidat.findOneAndDelete({ userId });
  } else if (user.role === "recruteur") {
    await Recruteur.findOneAndDelete({ userId });
  }

  
  // Supprimer l’utilisateur
  await User.findByIdAndDelete(userId);

  return { message: "Utilisateur et profil supprimés avec succès", userId };
}

/*update user*/

async function updateUser(id, updateData) {
  // Vérifier si l'utilisateur existe
  const user = await User.findById(id);
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  //  Si le mot de passe est mis à jour, le hasher
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  //  Mettre à jour seulement les champs présents dans updateData
  Object.keys(updateData).forEach(key => {
    user[key] = updateData[key];
  });

  //  Sauvegarder
  await user.save();

  // Retourner l'utilisateur mis à jour sans le mot de passe
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;
  delete userObj.createdAt;
  delete userObj.updatedAt;

  return userObj;
}

module.exports = { createUser, findUserById, deleteUserAndProfile, updateUser };
