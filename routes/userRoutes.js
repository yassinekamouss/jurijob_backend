const multer = require("multer");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");
const upload = multer({ dest: "uploads/" }); // Dossier temporaire pour stocker les fichiers téléchargés

router.post("/register", upload.single("image"), userController.registerUser);
router.delete("/delete-user", authenticateToken, userController.deleteUser);
router.patch("/update-user", authenticateToken, userController.updateUserInfo);
module.exports = router;
