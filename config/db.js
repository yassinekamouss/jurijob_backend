const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DB_URL;
    if (!mongoUri) throw new Error("Aucune URI MongoDB fournie.");

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on("error", err => {
      console.error("Erreur MongoDB:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB déconnecté. Tentative de reconnexion...");
    });

  } catch (error) {
    console.error("❌ Impossible de se connecter à MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
