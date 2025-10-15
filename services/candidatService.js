const Candidat = require("../models/Candidat");

async function createCandidatProfile(data) {
  const {
    userId,
    PosteRecherche,
    niveauExperience,
    formationJuridique,
    specialisations,
    langues,
    domainExperiences,
    typeTravailRecherche,
    villesTravailRecherche,
    modeTravailRecherche

  } = data;
  const existing = await Candidat.findOne({ userId });
  if (existing) {
    throw new Error("Le profil candidat existe déjà pour cet utilisateur");
  }
  const candidat = new Candidat({
    userId,
    PosteRecherche,
    niveauExperience,
    formationJuridique,
    specialisations,
    langues,
    domainExperiences,
    typeTravailRecherche,
    villesTravailRecherche,
    modeTravailRecherche
  });

  return await candidat.save();
}

async function updateCandidatProfile(userId, updateData) {
  const candidat = await Candidat.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!candidat) {
    throw new Error("Profil candidat introuvable");
  }

  return candidat;
}

module.exports = {
  createCandidatProfile,
  updateCandidatProfile,
};
