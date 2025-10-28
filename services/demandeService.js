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


/* Récupérer toutes les demandes d'un recruteur avec pagination et filtres */
async function getDemandesOfRecruteur(recruteurId, filters = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  // Construction dynamique de la requête MongoDB
  const query = { recruteurId };

  if (filters.titre) {
    query.titre = { $regex: filters.titre, $options: "i" }; // recherche insensible à la casse
  }
  if (filters.description) {
    query.description = { $regex: filters.description, $options: "i" };
  }
  if (filters.posteRecherche?.length) {
    query.posteRecherche = { $in: filters.posteRecherche };
  }
  if (filters.niveauExperience?.length) {
    query.niveauExperience = { $in: filters.niveauExperience };
  }
  if (filters.typeTravail?.length) {
    query.typeTravail = { $in: filters.typeTravail };
  }
  if (filters.modeTravail?.length) {
    query.modeTravail = { $in: filters.modeTravail };
  }
  if (filters.villesTravail?.length) {
    query.villesTravail = { $in: filters.villesTravail };
  }
  if (filters.formationJuridique?.length) {
    query.formationJuridique = { $in: filters.formationJuridique };
  }
  if (filters.specialisations?.length) {
    query.specialisations = { $in: filters.specialisations };
  }
  if (filters.domainExperiences?.length) {
    query.domainExperiences = { $in: filters.domainExperiences };
  }
  if (filters.statut) {
    query.statut = filters.statut;
  }

  // Exécution de la requête + pagination
  const [demandes, total] = await Promise.all([
    Demande.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Demande.countDocuments(query)
  ]);

  return { demandes, total, page, limit };
}


/* Récupérer une demande par ID */
async function getDemandeById(demandeId, recruteurId) {
  const demande = await Demande.findById(demandeId);
  if (!demande) {
    const err = new Error("Demande non trouvée");
    err.status = 404;
    throw err;
  }

  if (demande.recruteurId.toString() !== recruteurId) {
    const err = new Error("Accès refusé : vous ne pouvez consulter que vos propres demandes");
    err.status = 403;
    throw err;
  }

  return demande;
}

/* Supprimer une demande */
async function deleteDemande(demandeId, recruteurId) {
  const demande = await Demande.findById(demandeId);
  if (!demande) {
    const err = new Error("Demande non trouvée");
    err.status = 404;
    throw err;
  }

  if (demande.recruteurId.toString() !== recruteurId) {
    const err = new Error("Accès refusé : vous ne pouvez supprimer que vos propres demandes");
    err.status = 403;
    throw err;
  }

  await Demande.findByIdAndDelete(demandeId);
  return { message: "Demande supprimée avec succès" };
}


module.exports = {
  createDemande,
  updateDemande,
  getDemandesOfRecruteur,
  getDemandeById,
  deleteDemande
};