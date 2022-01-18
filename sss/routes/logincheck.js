const express = require("express");
const { signin, signup, signout, getUserById } = require("../controllers/auth");
const router = express.Router();
const User = require("../models/user");

router.param("Id", getUserById);
router.post("/login", signin);
router.post("/signup", signup);
router.delete("/signout", signout);

module.exports = router;
