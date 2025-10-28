const express = require("express");
const router = express.Router();
const Demande = require("../controllers/demandeController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/create", authenticateToken, Demande.createDemande);
router.patch("/update/:id", authenticateToken, Demande.updateDemande);
router.get("/recruteur/allDemandes", authenticateToken, Demande.getAllDemandesOfARecruteur);
router.get("/:id", authenticateToken, Demande.getDemandeById);
router.delete("/:id", authenticateToken, Demande.deleteDemande);
module.exports = router;