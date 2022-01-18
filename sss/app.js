var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
require("dotenv").config();
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var cors = require("cors");

var app = express();
var mongoose = require("mongoose");
var company = require("./routes/company");
var user = require("./routes/logincheck");
var form = require("./routes/form");
var item = require("./routes/item");
const pdf = require("html-pdf");
const pdfTemplate = require("./documents");

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("db is connected");
  })
  .catch(() => {
    console.log("db not connected");
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", company);
app.use("/user", user);
app.use("/form", form);
app.use("/item", item);
// app.use("/users", usersRouter);

app.post("/printpdf", (req, res) => {
  console.log("inside printpdf");
  pdf.create(pdfTemplate(req.body.inv), {}).toFile("result.pdf", (err) => {
    if (err) {
      res.status(400).json({ msg: err });
    }
    res.status(200).json({ msg: "success" });
  });
});

app.get("/getpdf", (req, res) => {
  console.log("inside getpdf");
  res.sendFile(`${__dirname}/result.pdf`);
  // res.json({ msg: "hello" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
