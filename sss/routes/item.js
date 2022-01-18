const express = require("express");
const {
  isAdmin,
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();
const Item = require("../models/item");

//params
router.param("userId", getUserById);

router.post(
  "/createitem/:id/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    const invoice_id = req.params.id;
    const { nature, Invoice, measurement, Particulars, freight } = req.body;
    const item = new Item({
      invoice_id: invoice_id,
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
  }
);

router.get(
  "/getitem/:id/:userId",
  isSignedIn,
  isAuthenticated,
  async (req, res) => {
    try {
      var items = await Item.find({ invoice_id: req.params.id });
      res.json(items);
    } catch (err) {
      res.send(400).json({ err: "error occured" });
    }
  }
);

module.exports = router;
