const User = require("../models/user");
const { check, validationResult } = require("express-validator");

var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.getUserById = async (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      res.status(401).json({
        err: "no user found in database",
      });
    }
    console.log(user);
    req.profile = user;
    next();
  });
};

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(402).json({
      err: errors.array()[0].msg,
    });
  }
  console.log("email was correct only");

  const user = new User(req.body);
  ///user._id=user.email;
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in db",
      });
    }
    console.log("signup SUCCESS");
    res.json({
      username: user.username,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  console.log("signin is working");
  const { email, password } = req.body;
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(402).json({
  //     err: errors.array()[0].msg,
  //   });
  // }

  User.findOne({ email: email, password: password }).exec((err, user) => {
    if (!user) {
      return res.status(400).json({
        err: "user not found in db",
      });
    }
    if (err) {
      res.status(400).json({
        err: "USER email does not exists",
      });
    }
    // if(!user.authentication(password)){
    //   return res.status(401).json({
    //     err: "Email does not match"
    //   })
    // }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //create cookie
    res.cookie("token", token, {
      expire: new Date() + 9999,
    });
    const { _id, username, email, role } = user;
    return res.json({
      token,
      user: { _id, username, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout succcessfully",
  });
  //  res.send("lololo")
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256", "RS256"],
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  console.log("auth", req.auth);

  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "you are not ADMIN,ACCESS DINIED",
    });
  }
  next();
};
