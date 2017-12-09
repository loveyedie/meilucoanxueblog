/**
 * Created by Administrator on 2017/12/2.
 */

var express = require('express');
var dbHelper = require('../models/dbHelper');
var async = require('async');

var config = require('../config');
var router = express.Router();
var Article = dbHelper.Article;

router.get('/:id',function(req, res, next){
    var id = req.params.id;
    async.waterfall([
        function (callback) {
            Article.findById(id).populate('_user _category').exec(function (err,article) {
                callback(null,article);
            })
        },
        function (article,callback) {
            article.views += 1;
            Article.update({_id: id},{views: article.views}, function (err, doc) {
                callback(null,article);
            });
        }
    ],function (err,article) {
        if(err){
            next(err);
        }else{
            res.render('p/detail',{
                article:article,
                layout: 'main'
            });
        }
    });

});


module.exports = router;