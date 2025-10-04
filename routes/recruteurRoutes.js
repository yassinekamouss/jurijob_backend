const express = require("express");
const router = express.Router();
const recruteurController = require("../controllers/recruteurController");

router.post("/complete-profile", recruteurController.completeRecruteurProfile);

module.exports = router;
