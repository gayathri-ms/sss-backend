const express = require("express");
const router = express.Router();
const Form = require("../models/form");
const Item = require("../models/item");
const formidable = require("formidable");
const { updatemiddleware, updateBalance } = require("../controllers/updategst");
const {
  isAdmin,
  isAuthenticated,
  isSignedIn,
  getUserById,
} = require("../controllers/auth");
const user = require("../models/user");

//params
router.param("userId", getUserById);

router.post(
  "/createform/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  (req, res) => {
    // let form = new formidable.IncomingForm();
    // form.keepExtensions = true;

    // form.parse((req) => {

    var date = new Date();

    // console.log("new dateee>>", date);
    var date2 = new Date();
    date2.setDate(date.getDate() + 20);
    // console.log("d2", date2);

    var localNow = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    var duelocal = new Date(
      date2.getTime() - date2.getTimezoneOffset() * 60000
    );
    const { invoice, vehicle_no, consignor, from, to, consignee, gst_com } =
      req.body;

    const dateObj = new Date(localNow);
    const month = dateObj.getMonth() + 1;
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const output = day + "-" + month + "-" + year;

    // console.log(duelocal);
    // console.log("local dateee>>", localNow);
    // const maxi = 0;
    // Form.aggregate({
    //   $group: {
    //     _id: null,
    //     max: { $max: "$invoice" },
    //   },
    // }).exec((err, users) => {
    //   if (err || !users) {
    //     return res.status(400).json({
    //       error: "no user was found in DB",
    //     });
    //   }
    //   // maxi = users;
    //   console.log("maxi", users);

    // });
    // console.log("maxi", maxi);

    let maxi = 0;
    Form.find().exec((err, users) => {
      if (err || !users) {
        return res.status(400).json({ err: "No user was found in DB" });
      }

      users.map((user) => {
        maxi = maxi < user.invoice ? user.invoice : user;
      });
      console.log("maxi", maxi);
      const form = new Form({
        invoice: maxi + 1,
        vehicle_no: vehicle_no,
        consignor: consignor,
        to: to,
        date: localNow,
        dateformat: output,
        due_date: duelocal,
        from: from,
        consignee: consignee,
        gst_com: gst_com,
      });

      form.save((err, f) => {
        if (err) {
          return res.status(400).json({
            error: "Cannot save the form - Invoice already exists",
          });
        }
        res.json(f);
      });
    });
    // form123456.map((f) => {
    //   maxi = maxi < f.invoice ? f.invoice : maxi;
    // });
    // console.log("maximum>>", maxi);

    // });
  }
);

//updayed route
router.put(
  "/updategst/:id/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updatemiddleware
);

//update balance
router.put(
  "/updatebalance/:id/:amount/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateBalance
);

//getform by date
router.get(
  "/getform123/:id/:userId",
  isSignedIn,
  isAuthenticated,
  (req, res) => {
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
  }
);

//getform by company
router.get(
  "/getform/:company/:userId",
  isSignedIn,
  isAuthenticated,
  (req, res) => {
    Form.find({ consignor: req.params.company }).exec((err, details) => {
      if (err || !details) {
        return res.status(400).json({
          error: "no details was found in DB",
        });
      }
      res.json(details);
    });
  }
);
//getform by invoice
router.get(
  "/getinvoice/:id/:userId",
  isSignedIn,
  isAuthenticated,
  (req, res) => {
    Form.find({ invoice: req.params.id }).exec((err, details) => {
      if (err || !details) {
        return res.status(400).json({
          error: "no details was found in DB",
        });
      }
      res.json(details);
    });
  }
);

//get form by consignee and date

// name changed

router.get("/getformall/:userId", isSignedIn, isAuthenticated, (req, res) => {
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

router.delete(
  "/deleteform/:id/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  (req, res) => {
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
  }
);

router.get("/getnotified/:userId", isSignedIn, isAuthenticated, (req, res) => {
  // var date = new Date();
  var date2 = new Date();
  // date2.setDate(date.getDate() + 20);
  var duelocal = new Date(date2.getTime() - date2.getTimezoneOffset() * 60000);
  var local = duelocal.toLocaleDateString();
  console.log("due", local);

  Form.aggregate([
    {
      $addFields: {
        date123: {
          $dateToString: {
            format: "%d/%m/%Y",
            date: "$due_date",
          },
        },
      },
    },
    {
      $match: {
        date123: { $eq: local },
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

router.get("/total/:userId", isSignedIn, isAuthenticated, (req, res) => {
  let sum = 0;
  Form.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "no user was found in DB",
      });
    }
    console.log(users);
    users.map((item, i) => {
      console.log("balance", item.balance);
      if (item.balance) sum = sum + item.balance;
    });
    console.log("total", sum);
    res.json({ total: sum });
  });
});

router.get("/payment/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Form.aggregate([
    {
      $group: {
        _id: { consignor: "$consignor" },

        balance: { $sum: "$balance" },
      },
    },
  ])
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.log("error");
      res.status(400).json({ msg: err });
    });
});

router.get(
  "/getform01/:userId",
  isSignedIn,
  isAuthenticated,
  async (req, res) => {
    console.log("in form");
    Form.find().exec((err, details) => {
      if (err || !details) {
        return res.status(400).json({
          error: "no details was found in DB",
        });
      }
      res.json(details);
    });
  }
);

module.exports = router;
