const Candidat = require("../models/Candidat");

async function createCandidatProfile(data) {
  const { userId, niveauExperience, formationJuridique, specialisations, langues } = data;

  const candidat = new Candidat({
    userId,
    niveauExperience,
    formationJuridique,
    specialisations,
    langues,
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


async function deleteCandidatProfile(userId) {
  const deleted = await Candidat.findOneAndDelete({ userId });

  if (!deleted) {
    throw new Error("Aucun profil candidat trouvé à supprimer");
  }

  return deleted;
}

module.exports = {
  createCandidatProfile,
  updateCandidatProfile,
  deleteCandidatProfile,
};