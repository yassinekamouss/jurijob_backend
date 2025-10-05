const express = require("express");
const router = express.Router();
const { login, refreshToken, logout , me} = require("../controllers/authController");

router.post("/login", login);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

router.get("/me", me);
module.exports = router;
