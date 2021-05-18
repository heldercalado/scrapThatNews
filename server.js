var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var Handlebars     = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');

HandlebarsIntl.registerWith(Handlebars);
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

//test


// Require all models
//var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();
// set handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// var to use the models


// Routes
var apiRoute = require('./routes/apiroutes')
app.use('/api', apiRoute);
var htmlRoute = require('./routes/htmlroutes')
app.use('/', htmlRoute);
// ...






app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});


//function to get data 


    