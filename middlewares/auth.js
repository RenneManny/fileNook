const User = require("../models/users");
module.exports = {
  isUserLoggedin: (req, res, next) => {
    if (req.session && req.session.userID) {
      next();
    } else {
      res.redirect("/users/login")
    }
  },
  //   second middleware
  UserInfo: (req, res, next) => {
    var userID = req.session && req.session.userID;
    if (userID) {
      User.findById(userID, "username")
        .then((userData) => {
          req.user = userData;
          // console.log(userData)
          res.locals.user = userData;
          next();
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res.user = null;
      res.locals.user = null;
      next();
    }
  },
};
