const mongoose = require("mongoose");

const item = new mongoose.Schema({
  form_id: {
    type: String,
    required: true,
  },
  nature: String,
  Invoice: Number,
  measurement: Number,
  Particulars: String,
  freight: Number,
});

module.exports = mongoose.model("Item", item);
