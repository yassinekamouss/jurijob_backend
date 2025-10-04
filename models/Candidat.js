const mongoose = require("mongoose");

const candidatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    niveauExperience: { type: String, required: true },
    formationJuridique: { type: String, required: true },
    specialisations: { type: [String], default: [] },
    langues: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidat", candidatSchema);
