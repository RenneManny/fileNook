var express = require("express");
var router = express.Router();
const User = require("../models/users");
// const  = require('');
/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.send("respond with a resource");
});

router.get("/register", (req, res) => {
  res.render("register", { error: null });
});
router.post("/register", (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  // console.log(username,email,passwordconfirm_password);

  if (password !== confirm_password) {
    return res.render("register", { error: "Passwords do not match" });
  }
  // hashing the password
  User.create({
    username,
    email,
    password,
  })
    .then((data) => {
      console.log("User created successffully!!");
      res.render("login");
    })
    .catch((err) => {
      console.log(err);
    });
});
// handling login
router.get("/login", (req, res) => {
  const error=req.flash("error")[0];
  res.render("login",{error});
});
router.post("/login", (req, res) => {
  // console.log(req);
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash('error','*Email/Password required* ')
    res.redirect("/users/login");
  }
  // checking password here
  User.findOne({ email })
    .then((user) => {
      if (!user) return res.redirect("/users/login");
      // else
      // compare password
      user.verifyPassword(password, (err, result) => {
        //  console.log("This is data:->"+err,result);
        if (err) {
          res.render("login");
        }
        if (!result) {
          return res.redirect("/users/login");
        }
        // else
        
        // create a session here...
        req.session.userID = user.id; //object is created here
        // res.redirect("/users");
        res.redirect("/auth/files");
      }); 
    })
    .catch((err) => {
      console.log(err);
      // next(err);
    });
});
// logout users
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect("users/login");
});
module.exports = router;
