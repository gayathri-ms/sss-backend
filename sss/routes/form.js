const express = require("express");
const router = express.Router();
const Form = require("../models/form");
const Item = require("../models/item");
const formidable = require("formidable");
const { updatemiddleware } = require("../controllers/updategst");

router.post("/createform", (req, res) => {
  // let form = new formidable.IncomingForm();
  // form.keepExtensions = true;

  // form.parse((req) => {

  var date = new Date();
  console.log("new dateee>>", date);

  var localNow = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  console.log("local dateee>>", localNow);

  const { invoice, vehicle_no, consignor, from, to, consignee, gst_com } =
    req.body;
  const form = new Form({
    invoice: invoice,
    vehicle_no: vehicle_no,
    consignor: consignor,
    to: to,
    date: localNow,
    from: from,
    consignee: consignee,
    gst_com: gst_com,
  });

  form.save((err, f) => {
    if (err) {
      return res.status(400).json({
        error: "cannot save the form",
      });
    }
    res.json(f);
  });
  // });
});

//updayed route
router.put("/updategst/:id", updatemiddleware);

router.get("/getform123/:id", (req, res) => {
  const date123 = req.params.id;
  Form.aggregate([
    {
      $addFields: {
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
          },
        },
      },
    },
    {
      $match: {
        date: { $eq: date123 },
      },
    },
  ]).exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "no user was found in DB",
      });
    }
    res.json(users);
  });
});

router.put("/updategst/:id", updatemiddleware);

//get form by consignee and date
router.get("/getform", (req, res) => {
  console.log("in form");
  Form.find().exec((err, details) => {
    if (err || !details) {
      return res.status(400).json({
        error: "no details was found in DB",
      });
    }
    res.json(details);
  });
});

router.delete("/deleteform/:id", (req, res) => {
  // Form.find({ invoice: req.params.id }).exec((err, form) => {
  //   if (err || !form) {
  //     return res.status(400).json({
  //       error: "no user was found in DB",
  //     });
  //   }
  //   console.log(form);

  //   Form.remove((err, frm) => {
  //     if (err) {
  //       return res.status(400).json({
  //         error: "fail to delete this form",
  //       });
  //     }
  //     res.json({
  //       message: "Sucessfully deleted",
  //     });
  //   });
  // });

  Form.remove({ invoice: req.params.id }).exec((err, form) => {
    if (err || !form) {
      return res.status(400).json({
        error: "no user was found in DB",
      });
    }
    res.json({ msg: "deleted" });
  });
});

// router.get("/getbyid/:id", (req,res,next) => {
//     const id = req.params.id;
//     Form.findById(id).exec((err,user) =>{
//         if(err)
//             res.status(400).json("user is not found");
//         req.profile = user;
//         next();

//     })
// })

module.exports = router;
