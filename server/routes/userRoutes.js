const express = require("express");
const { registerUser, loginUser ,currentUser, logoutUser} = require("../controllers/userControllers");
const validateToken = require("../middleware/validateTokenHandler");
const validateOldToken = require("../middleware/validateOldTokenHandler");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", validateOldToken, loginUser);

router.get("/current",validateToken, currentUser);

router.post("/logout", logoutUser);

module.exports = router;