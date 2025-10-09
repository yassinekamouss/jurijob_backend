const express = require("express");
const router = express.Router();
const Demande = require("../controllers/demandeController");

router.post("/create", Demande.createDemande);
router.patch("/update/:id", Demande.updateDemande);
module.exports = router;