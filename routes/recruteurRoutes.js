const express = require("express");
const router = express.Router();
const recruteurController = require("../controllers/recruteurController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/complete-profile", recruteurController.completeRecruteurProfile);
router.patch("/update-profile", authenticateToken, recruteurController.updateRecruteurProfile);
module.exports = router;
