const express = require("express");
const router = express.Router();
const { logoutuser, registeruser, loginuser } = require("../controller/userCtrl");
const auth = require("../middleware/authMiddleware");

router.post("/signup", registeruser);
router.post("/login", loginuser);
router.post("/logout", auth, logoutuser);

module.exports = router;