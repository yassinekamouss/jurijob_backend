const { findUserById } = require("../services/userService");
const { createCandidatProfile } = require("../services/candidatService");

exports.completeCandidatProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.role !== "candidat") {
      return res.status(400).json({ message: "Ce user n'est pas un candidat" });
    }

    const candidatProfile = await createCandidatProfile(req.body);

    res.status(201).json({
      message: "Profil candidat complété avec succès",
      profile: candidatProfile,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
