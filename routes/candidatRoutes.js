const express = require("express");
const router = express.Router();
const candidatController = require("../controllers/candidatController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/complete-profile", candidatController.completeCandidatProfile);
router.patch("/update-profile", authenticateToken, candidatController.updateCandidatProfile);
module.exports = router;
