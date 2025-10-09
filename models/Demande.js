const mongoose = require("mongoose");

const demandeSchema = new mongoose.Schema(
  {
    recruteurId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reférence au id de collection User
    titre: { type: String, required: true }, 
    description: { type: String },
    posteRecherche: { type: [String], required: true },
    niveauExperience: { type: [String], required: true },
    typeTravail: { type: [String], required: true },// Ex : "emploi", "stage"
    modeTravail: { type: [String], required: true },
    villesTravail: { type: [String], default: null }, // Peut être null pour le travail à distance
    formationJuridique: { type: [String], required: true }, // Ex : "Droit des affaires"
    specialisations: { type: [String], default: [] },
    domainExperiences: { type: [String], default: [] },
    langues: [
      {
        nom: { type: String },
        niveau: { type: String }
      }
    ],
    statut: { type: String, enum: ["ouverte", "fermee"], default: "ouverte" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Demande", demandeSchema);
