const Demande = require('../models/Demande');


/* Créer une nouvelle demande */
async function createDemande(data) {
  const nouvelleDemande = new Demande(data);
  return await nouvelleDemande.save();
}

/* Mettre à jour une demande */
async function updateDemande(demandeId, recruteurId, data) {
  // Vérifier si la demande existe
  const demande = await Demande.findById(demandeId);
  if (!demande) {
    throw new Error("Demande non trouvée");
  }

  if (demande.recruteurId.toString() !== recruteurId) {
    const err = new Error("Accès refusé : vous ne pouvez modifier que vos propres demandes");
    err.status = 403;
    throw err;
  }

  // Mise à jour
  const updatedDemande = await Demande.findByIdAndUpdate(demandeId, data, { new: true });
  return updatedDemande;
}


/* Récupérer toutes les demandes d'un recruteur avec pagination */
async function getDemandesOfRecruteur(recruteurId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [demandes, total] = await Promise.all([
    Demande.find({ recruteurId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Demande.countDocuments({ recruteurId })
  ]);
  return { demandes, total, page, limit };
}

module.exports = {
  createDemande,
  updateDemande,
  getDemandesOfRecruteur
};