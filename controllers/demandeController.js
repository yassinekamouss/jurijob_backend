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

/*recuperer toutes les demandes d'un recruteur avec pagination et filtres*/
async function getAllDemandesOfARecruteur(req, res) {
  try {
    const recruteurId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const parseArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value; // déjà un tableau
      return value.split(","); // si c'est une seule chaîne
    };

    const filters = {
      titre: req.query.titre,
      description: req.query.description,
      posteRecherche: parseArray(req.query.posteRecherche),
      niveauExperience: parseArray(req.query.niveauExperience),
      typeTravail: parseArray(req.query.typeTravail),
      modeTravail: parseArray(req.query.modeTravail),
      villesTravail: parseArray(req.query.villesTravail),
      formationJuridique: parseArray(req.query.formationJuridique),
      specialisations: parseArray(req.query.specialisations),
      domainExperiences: parseArray(req.query.domainExperiences),
      statut: req.query.statut
    };

    const result = await demandeService.getDemandesOfRecruteur(recruteurId, filters, page, limit);

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
