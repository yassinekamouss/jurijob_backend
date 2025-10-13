const mongoose = require("mongoose");
const Demande = require("../models/Demande");

async function getStatsRecruteur(recruteurId) {
  try {
    if (!recruteurId) {
      throw new Error("ID du recruteur manquant");
    }

    // Conversion en ObjectId
    const recruteurObjectId = new mongoose.Types.ObjectId(recruteurId);

    // --- 1. Compter les demandes par statut ---
    const statutAgg = await Demande.aggregate([
      { $match: { recruteurId: recruteurObjectId } },
      {
        $group: {
          _id: "$statut",
          count: { $sum: 1 }
        }
      }
    ]);

    // --- 2. Compter par mode de travail ---
    const modeTravailAgg = await Demande.aggregate([
      { $match: { recruteurId: recruteurObjectId } },
      { $unwind: "$modeTravail" },
      {
        $group: {
          _id: "$modeTravail",
          count: { $sum: 1 }
        }
      }
    ]);

    // --- 3. Compter par type de travail ---
    const typeTravailAgg = await Demande.aggregate([
      { $match: { recruteurId: recruteurObjectId } },
      { $unwind: "$typeTravail" },
      {
        $group: {
          _id: "$typeTravail",
          count: { $sum: 1 }
        }
      }
    ]);

    // --- 4. Compter le total ---
    const totalDemandes = await Demande.countDocuments({ recruteurId: recruteurObjectId });

    // --- Transformation propre ---
    const demandesOuvertes = statutAgg.find(s => s._id === "ouverte")?.count || 0;
    const demandesFermees = statutAgg.find(s => s._id === "fermee")?.count || 0;

    const modeTravailStats = {};
    modeTravailAgg.forEach(item => {
      modeTravailStats[item._id] = item.count;
    });

    const typeTravailStats = {};
    typeTravailAgg.forEach(item => {
      typeTravailStats[item._id] = item.count;
    });

    return {
      totalDemandes,
      demandesOuvertes,
      demandesFermees,
      modeTravailStats,
      typeTravailStats
    };

  } catch (error) {
    console.error("Erreur dans getStatsRecruteurService:", error.message);
    throw new Error("Impossible de récupérer les statistiques du recruteur");
  }
}

module.exports = {
  getStatsRecruteur
};
