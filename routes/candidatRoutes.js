const express = require("express");
const router = express.Router();
const candidatController = require("../controllers/candidatController");

router.post("/complete-profile", candidatController.completeCandidatProfile);
router.patch("/update-profile", candidatController.updateCandidatProfile);
module.exports = router;
