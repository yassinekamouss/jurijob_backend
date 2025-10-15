const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String , default: null },
    role: { type: String, enum: ["candidat", "recruteur", "admin"], required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("User", userSchema);
