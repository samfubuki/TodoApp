const express = require('express')
const mongoose = require('mongoose')
const dotenv = require("dotenv").config();
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
//connection to mongodb

const mongo_uri = process.env.mongo_uri;

const connect = mongoose.connect(mongo_uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
connect.then(
    (db) => {
      console.log("Database Connected Successfully");
    },
    (err) => {
      console.log("Error occur while connecting ", err);
    }
);

//middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(passport.initialize());

// routes
app.use(require("./routes/index"))
app.use(require("./routes/todo"))


//Passport configuration

app.use(
  require("express-session")({
    secret: "I am the best",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//To get current logged in user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


app.listen(3000, () => console.log("Server started listening on port: 3000"));


