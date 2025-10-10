// controllers/demandeController.js
const demandeService = require("../services/demandeService");

/**
 * Créer une nouvelle demande
 */
async function createDemande(req, res) {
  try {
    const userId = req.userId; // Récupéré depuis le middleware d'authentification
    const data = req.body;

    const demande = await demandeService.createDemande({ ...data, recruteurId: userId });
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
    const recruteurId = req.userId; /*(c'est tjrs l'id du recruteur dans la collection user pas dans la collection recruteur) 
                                        Récupéré depuis le middleware d'authentification*/

    const demande = await demandeService.updateDemande(id , recruteurId , data);

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


/* Récupérer toutes les demandes d'un recruteur avec pagination */
async function getAllDemandesOfARecruteur(req, res) {
  try {
    const recruteurId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await demandeService.getDemandesOfRecruteur(recruteurId, page, limit);

    return res.status(200).json({
      message: "Demandes récupérées avec succès",
      ...result
    });
  } catch (error) {
    console.error("Erreur récupération demandes recruteur :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des demandes" });
  }
}


module.exports = {
  createDemande,
  updateDemande,
  getAllDemandesOfARecruteur
};
