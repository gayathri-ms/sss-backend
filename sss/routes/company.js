const express = require("express");
const {
  isAdmin,
  isSignedIn,
  isAuthenticated,
  getUserById,
} = require("../controllers/auth");
const router = express.Router();
const Company = require("../models/company");

router.param("userId", getUserById);

// router.get("/:id", async (req, res) => {
//   console.log("in company..!");
//   const company = req.params.id;
//   var details = await Company.find({ company_name: company });
//   res.json(details);
// });
router.get(
  "/getcompany/:id/:userId",
  isSignedIn,
  isAuthenticated,
  async (req, res) => {
    console.log("in company..!");
    const company = req.params.id;
    var details = await Company.find({ company_name: company });
    res.json(details);
  }
);

router.post(
  "/add/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  (req, res) => {
    const { company_name, address, GST } = req.body;
    const company = new Company({
      company_name: company_name,
      address: address,
      GST: GST,
    });
    company.save((err, com) => {
      if (err) {
        return res.status(400).json({ err: "cannot save the data" });
      }
      res.json(com);
    });
  }
);

router.get("/companyname/:userId", isSignedIn, isAuthenticated, (req, res) => {
  Company.aggregate([
    {
      $group: {
        _id: { company_name: "$company_name" },
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
  "/allcompany/:userId",
  isSignedIn,
  isAuthenticated,
  async (req, res) => {
    var detail = await Company.find();
    res.json(detail);
  }
);
module.exports = router;
