/**
 * Created by Administrator on 2017/12/3.
 */
var express = require('express');
var router = express.Router();

var async = require('async');
var webHelper = require('../../lib/webHelper');
var dbHelper = require('../../models/dbHelper');
var articleDao = require('../../models/articleDao');
var config = require('../../config');
var lodash = require('lodash');

var Article = dbHelper.Article;
var User = dbHelper.User;
var Category = dbHelper.Category;

var md = webHelper.Remarkable();

var getTags = function (value) {
    return lodash.split(value,',');
};

//管理文章列表
router.get('/',function (req,res) {
    var catId = req.query.catId || '';
    var page = req.query.page || 1;
    var pageSize = config.article.pageSize;
    var queryParams = {};              //_user: req.session.user._id
    if(catId) queryParams._category = catId;
    async.parallel({
        cats: function (done) {
            Category.find({status: true}).exec(function (err,doc) {
                done(err,doc);
            });
        },
        pageInfo:function (done) {
            dbHelper.Methods.pageQuery(page,pageSize,Article,'_category',queryParams,{'created_time':'desc'},function (err, pageInfo) {
                done(err,pageInfo);
            })
        }
    },function (err, result) {
        var articles = result.pageInfo.results;
        res.render('admin/p/list',{
            articles:articles,
            currentCat:catId,
            cats:result.cats,
            pageInfo:result.pageInfo,
            menu:'p-list',
            layout:'manage'
        });
    });
    /*articleDao.findArticleByUser(req.session.user._id,function (articles) {
        res.render('admin/p/list',{articles:articles,menu:'p-list',layout:'manage'});
    })*/
});

//添加文章
router.get('/create',function (req, res) {
    Category.find({status: true}).exec(function (err,doc) {
        res.render('admin/p/create',{
            cats:doc,
            menu:'p-list',
            layout:'manage'
        });
    });
});

//提交更新文章
router.post('/create', function (req, res, next) {
    var article = req.body;
    article.tags = getTags(article.articleTags);
    article._user = req.session.user._id;
    article._category = article.category;
    article.html = md.render(article.content);
    articleDao.saveOrUpdate(article,function (err, doc) {
        webHelper.reshook(err, next, function () {
            req.flash(config.constant.flash.success,'文章添加成功！');
            res.redirect('/admin/p');
        });
    })
});

//文章删除
router.get('/delete/:id', function (req, res, next) {
    var id = req.params.id;
    Article.findById(id, function (err, doc) {
        if(doc){
            doc.remove(function (err,doc) {
                webHelper.reshook(err, next, function () {
                    req.flash(config.constant.flash.success, '删除文章成功！');
                    res.redirect('/admin/p');
                })
            })
        }else{
            next(err);
        }
    });
});

//文章编辑
router.get('/edit/:id', function (req, res, next) {
    var id = req.params.id;
    async.parallel({
        cats:function (done) {
            Category.find({status:true}).exec(function (err, doc) {
                done(err,doc);
            });
        },
        article:function (done) {
            Article.findById(id, function (err, doc) {
                done(err, doc);
            })
        }
    },function (err,result) {
        if(err){
            next(err);
        }else{
            var cats = result.cats;
            for(var i = 0; i < cats.length; i ++){
                if(cats[i]._id + '' == ''+ result.article._category) cats[i].selected = "selected";
            }
            res.render('admin/p/create', {
                article: result.article,
                cats:cats,
                types: config.article.types,
                menu: 'p-list',
                layout:'manage'
            })
        }
    });
});

//置顶文章
router.get('/up/:id', function (req, res, next) {
    var id = req.params.id;
    var up = req.query.up;
    up = up && up == 'true' ? false : true;
    Article.update({_id: id}, {up: up}, function (err, doc) {
        if(err){
            next(err);
        }else{
            res.redirect('/admin/p');
        }
    });
});

//推荐文章
//置顶文章
router.get('/recommend/:id', function (req, res, next) {
    var id = req.params.id;
    var recommend = req.query.recommend;
    recommend = recommend && recommend == 'true' ? false : true;
    Article.update({_id: id}, {recommend: recommend}, function (err, doc) {
        if(err){
            next(err);
        }else{
            res.redirect('/admin/p');
        }
    });
});

module.exports = router;