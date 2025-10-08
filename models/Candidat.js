const mongoose = require("mongoose");

const candidatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    niveauExperience: { type: String, required: true },
    formationJuridique: { type: String, required: true },
    specialisations: { type: [String], default: null },
    domainExperiences: { type: [String], default: null },
    langues: { type: [String], default: null },
    imageUrl: { type: String , default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidat", candidatSchema);
