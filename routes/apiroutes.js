var express = require('express')
var router = express.Router()
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
router.get("/", function (req, res) {


    axios.get("https://www.cbsnews.com/").then(function (response) {

        // Load the HTML into cheerio

        try {
            var $ = cheerio.load(response.data);


        } catch (e) {
            console.log(e) // handle error
        }

        // Make an empty array for saving our scraped info
        var results = [];

        // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
        $("article.item").each(function (i, element) {

            /* Cheerio's find method will "find" the first matching child element in a parent.
             *    We start at the current element, then "find" its first child a-tag.
             *    Then, we "find" the lone child img-tag in that a-tag.
             *    Then, .attr grabs the imgs srcset value.
             *    The srcset value is used instead of src in this case because of how they're displaying the images
             *    Visit the website and inspect the DOM if there's any confusion
             */
            //var topic = $(element).find("div.flex-container-column.align-items-start.flex").find("ul.tag-list-wrapper").find("li").find("a").text();

            var headlineUrl =$(element).find("a.item__anchor").attr("href");
            var imgUrl =$(element).find("span.img").find("img").attr("src"); 
            var headline = $(element).find("h4.item__hed").text().replace("\n","").trim();
            var article = $(element).find("p.item__dek").text().replace(/[\n]/g,'').trim();
            
            
            
if (article.indexOf("CBSN")===-1){
    

    var myObj = {

        headline: headline,
        article:article,
        imgUrl:imgUrl,
        headlineUrl: headlineUrl,
        date:Date.now()
    }
    results.push(myObj);

}
   })
        console.log(results);
        //command to add all in one line into mongoose
        db.Article.collection.insert(results, function (err, docs) {
            if (err){ 
                return console.error(err);
            } else {
              console.log("Multiple documents inserted to Collection");
            }
          });
        
        res.json(results);
    })

   

});

router.get("/articles", function (req, res) {

db.Article.find().then(data =>{

res.json(data);


})




})
router.post("/submit/:id", function(req, res) {
    console.log(req.params.id);
    console.log(req.body);

    // Create a new Note in the db
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({_id:req.params.id}, { $set: { note: dbNote._id }},{ new: true } );
      })
      .then(function(article) {
        db.Article.find({}).sort({date:-1}).populate('note').then(data =>{
            res.redirect("/");
        })
        
        
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });
router.get("/populatedarticle", function(req, res) {
    // Find all users
    db.Article.find({})
      // Specify that we want to populate the retrieved users with any associated notes
      .populate("note")
      .then(function(articles) {
        // If able to successfully find and associate all Users and Notes, send them back to the client
        res.json(articles);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

module.exports = router