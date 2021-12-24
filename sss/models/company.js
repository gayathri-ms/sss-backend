const mongoose = require("mongoose");

const company_schema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  GST: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("company", company_schema);
