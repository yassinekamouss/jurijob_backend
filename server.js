const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

const connectDB = require("./config/db");

// Import des routes
const userRoutes = require("./routes/userRoutes");
const candidatRoutes = require("./routes/candidatRoutes");
const recruteurRoutes = require("./routes/recruteurRoutes");
const authRoutes = require("./routes/authRoutes");
const demandeRoutes = require("./routes/demandeRoutes");

const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true, //  CRUCIAL pour les cookies
  })
);
app.use(cookieParser());
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
app.use("/api/candidats", candidatRoutes);
app.use("/api/recruteurs", recruteurRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/demandes", demandeRoutes);
// Lancer le serveur avec connexion DB
async function startServer() {
  try {
    await connectDB(); // attendre la connexion DB

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB, server not started", error);
    process.exit(1);
  }
}
startServer();
