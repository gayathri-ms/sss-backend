const mongoose = require("mongoose");

const item = new mongoose.Schema({
  invoice_id: {
    type: Number,
    required: true,
  },
  nature: String,
  Invoice: String,
  measurement: String,
  Particulars: String,
  freight: Number,
});

module.exports = mongoose.model("Item", item);
