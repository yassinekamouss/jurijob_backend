const statsRecruteurService = require("../services/statsRecruteurService");

/**
 * Contrôleur pour récupérer les statistiques du recruteur connecté
 */
exports.getStatsRecruteur = async (req, res) => {
  try {
    const recruteurId = req.userId; // ID récupéré depuis le token (middleware d’authentification)

    if (!recruteurId) {
      return res.status(400).json({ message: "ID du recruteur manquant" });
    }

    const stats = await statsRecruteurService.getStatsRecruteur(recruteurId);

    return res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error("Erreur dans statsRecruteurController:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};
