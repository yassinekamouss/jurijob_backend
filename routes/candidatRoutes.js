const express = require("express");
const router = express.Router();
const candidatController = require("../controllers/candidatController");

router.post("/complete-profile", candidatController.completeCandidatProfile);
router.put("/update-profile", candidatController.updateCandidatProfile);
router.delete("/delete-profile/:userId", candidatController.deleteCandidatProfile);
module.exports = router;
