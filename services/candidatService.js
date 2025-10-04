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

module.exports = { createCandidatProfile };
