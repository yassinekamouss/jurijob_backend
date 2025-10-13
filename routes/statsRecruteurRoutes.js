const express = require("express");
const router = express.Router();
const statsRecruteurController = require("../controllers/statsRecruteurController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/recruteur", authenticateToken, statsRecruteurController.getStatsRecruteur);

module.exports = router;

