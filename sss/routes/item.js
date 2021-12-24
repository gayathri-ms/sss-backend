const express = require("express");
const router = express.Router();
const Item = require("../models/item");

router.post("/createitem/:id", async (req, res) => {
  const form_id = req.params.id;
  const { nature, Invoice, measurement, Particulars, freight } = req.body;
  const item = new Item({
    form_id: form_id,
    nature: nature,
    Invoice: Invoice,
    measurement: measurement,
    Particulars: Particulars,
    freight: freight,
  });
  item.save((err, it) => {
    if (err) return res.status(400).json({ err: "cannot save the details" });
    res.json(it);
  });
});

router.get("/getitem/:id", async (req, res) => {
  try {
    var items = await Item.find({ form_id: req.params.id });
    res.json(items);
  } catch (err) {
    res.send(400).json({ err: "error occured" });
  }
});

module.exports = router;
