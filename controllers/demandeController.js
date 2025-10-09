// controllers/demandeController.js
const demandeService = require("../services/demandeService");

/**
 * Créer une nouvelle demande
 */
async function createDemande(req, res) {
  try {
    const data = req.body;

    const demande = await demandeService.createDemande(data);
    return res.status(201).json({
      message: "Demande créée avec succès",
      demande
    });
  } catch (error) {
    console.error("Erreur création demande :", error);
    return res.status(500).json({ message: "Erreur lors de la création de la demande" });
  }
}

/**
 * Mettre à jour une demande existante
 */
async function updateDemande(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const demande = await demandeService.updateDemande(id, data);

    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    return res.status(200).json({
      message: "Demande mise à jour avec succès",
      demande
    });
  } catch (error) {
    console.error("Erreur mise à jour demande :", error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour de la demande" });
  }
}

module.exports = {
  createDemande,
  updateDemande
};
