const mongoose = require("mongoose");

const candidatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    PosteRecherche: { type: String, required: true },
    niveauExperience: { type: String, required: true },
    formationJuridique: { type: String, required: true },
    specialisations: { type: [String], default: null },
    domainExperiences: { type: [String], default: null },
    langues: [
      {
        nom: { type: String, required: true },
        niveau: { type: String, required: true }
      }
    ],
    typeTravailRecherche: { type: [String], required: true },// Ex : "emploi", "stage"
    modeTravailRecherche: { type: [String], required: true },
    villesTravailRecherche: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidat", candidatSchema);