const express = require("express");
const router = express.Router();
const Company = require("../models/company");

router.get("/:id", async (req, res) => {
  console.log("in company..!");
  const company = req.params.id;
  var details = await Company.find({ company_name: company });
  res.json(details);
});

router.post("/add", (req, res) => {
  const company = new Company(req.body);
  company.save((err, com) => {
    if (err) {
      return res.status(400).json({ err: "cannot save the data" });
    }
    res.json(com);
  });
});

router.get("/allcompany", async (req, res) => {
  var detail = await Company.find();
  res.json(detail);
});
module.exports = router;
