var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");

var app = express();

var mongojs = require("mongojs");
var db = mongojs("customerapp", ["users"]);
var ObjectId = mongojs.ObjectId;

//view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set static path
app.use(express.static(path.join(__dirname, "public")));

//Globar vars
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});

// Express Validator middleware
app.use(expressValidator());

app.get("/", function(req, res) {
  db.users.find(function(err, docs) {
    res.render("index", {
      title: "Customers",
      users: docs
    });
  });
});

app.post("/users/add", function(req, res) {
  req.checkBody("first_name", "First Name is required").notEmpty();
  req.checkBody("last_name", "Last Name is required").notEmpty();
  req.checkBody("email", "E-Mail is required").notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    console.log("Error!");
    res.render("index", {
      title: "Customers",
      users: users,
      errors: errors
    });
  } else {
    let newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    };
    console.log("Success!");
    db.users.insert(newUser, function(err, result) {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    });
  }
});

app.delete("/users/delete/:id", function(req, res) {
  db.users.remove({ _id: ObjectId(req.params.id) }, function(err, result) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
  console.log(req.params.id);
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
