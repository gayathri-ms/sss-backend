const Form = require("../models/form");
const Item = require("../models/item");

exports.updatemiddleware = (req, res) => {
  const form_id = req.params.id;

  let sum = 0;

  Item.find({ form_id: form_id }).exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "no user was found in DB",
      });
    }
    // console.log("userss", users);

    users.map((obj, _) => (sum = sum + obj.freight));
    console.log("sum", sum);

    Form.findByIdAndUpdate(
      { _id: form_id },
      { $set: { gst: req.body.gst, total: sum } },
      { new: true, useFindAndModify: false },
      (err, item) => {
        if (err) {
          return res.status(400).json({
            error: "your cant update this Item ",
          });
        }
        res.json(item);
      }
    );
  });
};
