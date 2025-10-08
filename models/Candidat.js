const mongoose = require("mongoose");

const candidatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    posteActuel: { type: String, required: true },
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
    typeTravail: {  type: String,  required: true},// Ex : "emploi", "stage"
    modeTravail: { type: String, required: true },
    villesTravail: { type: [String], required: true },
    imageUrl: { type: String , default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidat", candidatSchema);