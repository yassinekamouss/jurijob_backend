// services/userService.js
const User = require("../models/User");
const Candidat = require("../models/Candidat");
const Recruteur = require("../models/Recruteur");
const bcrypt = require("bcryptjs");
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require("../utils/uploadImage");

/**
 * Champs autorisés pour la mise à jour (prévenir l'élévation de privilèges)
 */
const ALLOWED_UPDATE_FIELDS = ["nom", "prenom", "email", "telephone", "isActive", "isArchived", "imageUrl", "imagePublicId", "password"];

/**
 * Sanitize user object before returning au client
 */
function sanitizeUser(userDoc) {
  const obj = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete obj.password;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
}


/*
 * createUser - création d'un utilisateur avec upload image optionnel
 */
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
  let imagePublicId = null;

  // Upload image if provided
  if (imageFile && imageFile.path) {
    const uploadResult = await uploadImageToCloudinary(imageFile); // lance upload + supprime local dans finally
    if (uploadResult) {
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
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
    imagePublicId,
  });

  const saved = await user.save();
  return sanitizeUser(saved);
}

/**
 * findUserById
 */
async function findUserById(userId) {
  if (!userId) return null;
  return await User.findById(userId);
}

/**
 * deleteUserAndProfile - supprime user + profil lié + image cloudinary si existante
 */
async function deleteUserAndProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  // Supprimer l’image Cloudinary si disponible (ignorer erreurs non critiques)
  if (user.imagePublicId) {
    try {
      await deleteImageFromCloudinary(user.imagePublicId);
    } catch (err) {
      console.warn("Impossible de supprimer l'image cloudinary:", err.message || err);
    }
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

/*
 * updateUser - met à jour les champs autorisés + gère l'upload d'une nouvelle image (remplace la précédente)
 */
async function updateUser(id, updateData = {}, imageFile = null) {
  // Vérifier si l'utilisateur existe
  const user = await User.findById(id);
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  // Si un nouveau fichier est envoyé, uploader et remplacer imagePublicId/imageUrl
  if (imageFile && imageFile.path) {
    // Tenter de supprimer l'ancienne image cloudinary (si existante)
    if (user.imagePublicId) {
      try {
        await deleteImageFromCloudinary(user.imagePublicId);
      } catch (err) {
        console.warn("Erreur suppression ancienne image cloudinary:", err.message || err);
        // continue anyway — on va uploader la nouvelle
      }
    }

    // upload nouvelle image (uploadImageToCloudinary supprime le fichier local dans son finally)
    const result = await uploadImageToCloudinary(imageFile);
    if (result) {
      updateData.imageUrl = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }
  }

  // Si password mis à jour, le hasher
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  // Mettre à jour seulement les champs autorisés
  for (const key of Object.keys(updateData)) {
    if (ALLOWED_UPDATE_FIELDS.includes(key)) {
      user[key] = updateData[key];
    } else {
      console.warn(`Champ non autorisé ignoré: ${key}`);
    }
  }

  await user.save();

  return sanitizeUser(user);
}

module.exports = {
  createUser,
  findUserById,
  deleteUserAndProfile,
  updateUser,
};
