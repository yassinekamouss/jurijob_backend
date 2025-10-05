const Recruteur = require("../models/Recruteur");

async function createRecruteurProfile(data) {
  const { userId, nomEntreprise, poste, typeOrganisation, tailleEntreprise, siteWeb, ville, codePostal } = data;

  const recruteur = new Recruteur({
    userId,
    nomEntreprise,
    poste,
    typeOrganisation,
    tailleEntreprise,
    siteWeb,
    ville,
    codePostal,
  });

  return await recruteur.save();
}

module.exports = { createRecruteurProfile };
