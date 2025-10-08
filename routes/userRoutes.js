const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.delete("/delete-user/:userId", userController.deleteUser);
router.patch("/update-user/:id", userController.updateUserInfo);
module.exports = router;
