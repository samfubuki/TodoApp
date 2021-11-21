const router = require("express").Router()
const Todo = require("../models/Todo");
const passport = require("passport");
const User = require("../models/user");

// routes will be here....

//Login Route
router.get("/", (req, res) => {
    res.render("login");
  });
  
  //handle login logic
  // ----------> router.post('/login', middleware, callback)
  router.post(
    "/",
    passport.authenticate("local", {
      successRedirect: "/todo",
      failureRedirect: "/",
    }),
    (req, res) => {}
  );

//show register form
router.get("/register", (req, res) => {
    res.render("register");
  });
  
  //handle signup logic
  router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, () => {
        res.redirect("/todo");
      });
    });
  });

//logout route

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/todo");
  });

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }    




//Todo Task is here
router.get("/todo", async(req, res) => {
    const allTodo = await Todo.find();
    res.render("index", {todo: allTodo})
})


module.exports = router;