const Demande = require('../models/Demande');

async function createDemande(data) {
  const nouvelleDemande = new Demande(data);
  return await nouvelleDemande.save();
}


async function updateDemande(demandeId, data) {
  return await Demande.findByIdAndUpdate(demandeId, data, { new: true });
}

module.exports = {
  createDemande,
  updateDemande
};