const mongoose = require("mongoose");

const form = new mongoose.Schema({
  invoice: {
    type: Number,
  },
  vehicle_no: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  consignor: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  consignee: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  gst_com: {
    type: String,
    required: true,
  },
  // items: {
  //   type: Array,
  //   default: [],
  // },
  total: {
    type: Number,
    default: 0,
  },
  gst: Number,
  grandtotal: Number,
});

module.exports = mongoose.model("Form1", form);
