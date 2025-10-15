const { createUser , deleteUserAndProfile , updateUser } = require("../services/userService");

exports.registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body,  req.file);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/**
 * Supprime un utilisateur et son profil associé
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId  = req.userId;

    const result = await deleteUserAndProfile(userId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/*update user*/
exports.updateUserInfo = async (req, res) => {
  try {
    const  id = req.userId;
    const updateData = req.body;

    const updatedUser = await updateUser(id, updateData);

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};