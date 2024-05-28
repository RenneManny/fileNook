var createError = require("http-errors");
var express = require("express");
var methodOverride = require('method-override')
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const multer = require("multer");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
var flash = require('connect-flash');
require("dotenv").config();
// establishing database connection
// mongoose.connect("mongodb://localhost:27017/fileNook")
// const mongoose=require("mongodb://127.0.0.1:27017/fileNook");
mongoose.connect("mongodb://127.0.0.1:27017/fileNook");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// var auth = require('./middlewares/auth');
var authRouter = require("./routes/authRoutes");
const auth = require("./middlewares/auth");

// const user = require("./models/users");
// const auth = require("./middlewares/auth");
var app = express();
app.use(methodOverride('_method'))
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
// console.log(path.join(__dirname + "/uploads"));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});
// upload static

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use('/static', express.static(path.join(__dirname, 'public')))
// add session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(flash())
// data to template
app.use(auth.UserInfo);
//routing middlewares
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(auth.isUserLoggedin);
app.use("/auth", authRouter);

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
