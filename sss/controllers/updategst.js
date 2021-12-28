const Form = require("../models/form");
const Item = require("../models/item");

exports.updatemiddleware = (req, res) => {
  const invoice_id = req.params.id;

  let sum = 0;

  Item.find({ invoice_id: invoice_id }).exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "no user was found in DB",
      });
    }
    // console.log("userss", users);

    users.map((obj, _) => (sum = sum + obj.freight));
    console.log("sum", sum);
    const gst = (sum * req.body.gst) / 100;
    const grand_total = sum + gst;

    Form.find({ invoice: invoice_id }).exec((err, it) => {
      if (err || !it) {
        return res.status(400).json({
          error: "no user was found in DB",
        });
      }
      console.log(it);
      Form.findByIdAndUpdate(
        { _id: it[0]._id },
        { $set: { gst: req.body.gst, total: sum, grandtotal: grand_total } },
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
  });
};
