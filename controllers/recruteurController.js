const { findUserById } = require("../services/userService");
const { createRecruteurProfile } = require("../services/recruteurService");

exports.completeRecruteurProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.role !== "recruteur") {
      return res.status(400).json({ message: "Ce user n'est pas un recruteur" });
    }

    const recruteurProfile = await createRecruteurProfile(req.body);

    res.status(201).json({
      message: "Profil recruteur complété avec succès",
      profile: recruteurProfile,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
