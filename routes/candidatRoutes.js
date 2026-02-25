const express = require("express");
const router = express.Router();
const candidatController = require("../controllers/candidatController");
const authenticateToken = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/diplomas");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/complete-profile", upload.any(), candidatController.completeCandidatProfile);
router.patch("/update-profile", authenticateToken, upload.any(), candidatController.updateCandidatProfile);
router.patch("/update-parcours", authenticateToken, upload.any(), candidatController.updateCandidatParcours);
module.exports = router;
