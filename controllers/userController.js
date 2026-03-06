const { createUser, deleteUserAndProfile, updateUser, checkEmailExists } = require("../services/userService");

exports.registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body, req.file);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    if (error.code === "EMAIL_CONFLICT") {
      return res.status(409).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

/**
 * Vérifie si un email est déjà utilisé (pour validation côté signup)
 */
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }
    const exists = await checkEmailExists(email);
    if (exists) {
      return res.status(409).json({ message: "Cet email est déjà utilisé par un autre compte." });
    }
    res.status(200).json({ available: true });
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


/**
 * Supprime un utilisateur et son profil associé
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await deleteUserAndProfile(userId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/*update user*/
exports.updateUserInfo = async (req, res) => {
  try {
    const id = req.userId;
    const updateData = req.body;

    const updatedUser = await updateUser(id, updateData, req.file);

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser
    });
  } catch (err) {
    if (err.code === "EMAIL_CONFLICT") {
      return res.status(409).json({ message: err.message });
    }
    res.status(400).json({ message: err.message });
  }
};