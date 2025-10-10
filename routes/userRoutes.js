const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/register", userController.registerUser);
router.delete("/delete-user", authenticateToken, userController.deleteUser);
router.patch("/update-user", authenticateToken, userController.updateUserInfo);
module.exports = router;
