const Recruteur = require("../models/Recruteur");

async function createRecruteurProfile(data) {
  const { userId, nomEntreprise, poste, typeOrganisation, tailleEntreprise, siteWeb, ville, codePostal } = data;


    const existing = await Recruteur.findOne({ userId });
  if (existing) {
    throw new Error("Le profil recruteur existe déjà pour cet utilisateur");
  }

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

/*Update du profil recruteur */

async function updateRecruteurProfile(userId, updateData) {
  const updated = await Recruteur.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new Error("Profil recruteur introuvable");
  }

  return updated;
}


module.exports = {
  createRecruteurProfile,
  updateRecruteurProfile,
  };