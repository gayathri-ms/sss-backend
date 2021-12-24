const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/login", async (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) return res.status(400).json({ err: "cannot save the details" });
    res.json(user);
  });
});

router.get("/login", (req, res) => {
  console.log("hello");
  res.send("working");
});

module.exports = router;
