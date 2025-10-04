const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const connectDB = require("./config/db");

// Import des routes
const authRoutes = require("./routes/authRoutes");
const candidatRoutes = require("./routes/candidatRoutes");
const recruteurRoutes = require("./routes/recruteurRoutes");

const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); // pour lire JSON dans req.body

// Route test
app.get("/", (req, res) => {
  res.json({
    message: `
    =====================
    = Hello From Jurijob! =
    =====================
    `,
    status: 200,
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/candidats", candidatRoutes);
app.use("/api/recruteurs", recruteurRoutes);

// Lancer le serveur avec connexion DB
async function startServer() {
  try {
    await connectDB(); // attendre la connexion DB

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB, server not started", error);
    process.exit(1); 
  }
}
startServer();
