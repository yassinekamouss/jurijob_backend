const mongoose = require("mongoose");

const recruteurSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    nomEntreprise: { type: String, required: true },
    poste: { type: String, required: true },
    typeOrganisation: { type: String, required: true },
    tailleEntreprise: { type: String, required: true },
    siteWeb: { type: String , default: null },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recruteur", recruteurSchema);