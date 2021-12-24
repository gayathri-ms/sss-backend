const express = require("express");
const router = express.Router();
const Form = require("../models/form");
const formidable = require("formidable");

router.post("/form", (req, res) => {
  //   let form = new formidable.IncomingForm();
  //   form.keepExtensions = true;

  //   form.parse((req) => {
  const form = new Form(req.body);

  form.save((err, f) => {
    if (err) {
      return res.status(400).json({
        error: "cannot save the form",
      });
    }
    res.json(f);
  });
  //   });
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
