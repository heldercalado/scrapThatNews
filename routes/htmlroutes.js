var express = require('express')
var router = express.Router()
var db = require("../models");


router.get("/", function (req, res) {
db.Article.find().sort({date:-1}).populate('note').then(data => {
    res.render("index",{article:data})
})


})






module.exports = router