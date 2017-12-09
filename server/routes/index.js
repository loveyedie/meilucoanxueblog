/**
 * Created by Administrator on 2017/11/21.
 */
var express = require('express');
var dbHelper = require('../models/dbHelper');

var config = require('../config');
var router = express.Router();
var passport = require('passport');
var utils  = require('utility');
var async = require('async');

function getPostsByCategory(catId, page, searchStr, callback) {
    var Article = dbHelper.Article;
    var Category = dbHelper.Category;
    if(!page) page = 1;
    var pageSize = config.article.pageSize;

    var queryParams = {};
    if(catId) queryParams._category = catId;
    if(searchStr){
        var titleReg = new RegExp(''+ searchStr +'');
        queryParams.title = titleReg;
    }

    dbHelper.Methods.pageQuery(page,pageSize,Article,'_category',queryParams,{'created_time':'desc'},function (err, pageInfo) {
        callback(err,pageInfo);
    });
}

function getDataForIndex(page, callback) {
    page = page || 1;
    var pageSize = config.article.pageSize;
    var Article = dbHelper.Article;
    async.parallel({
        pageInfo: function (done) {
            dbHelper.Methods.pageQuery(page,pageSize,Article,'_user _category',{},{'created_time':'desc'},function (err, pageInfo) {
                done(err,pageInfo);
            });
        },
        recommend: function (done) {
            Article.find({recommend:true}).limit(10).populate('_user _category').sort({'created_time':'desc'}).exec(function(err,doc){
                done(err,doc);
            });
        },
        hotArticle: function (done) {
            Article.find().limit(10).populate('_user _category').sort({'views':'desc'}).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, result) {
        callback(err,result);
    });
}

router.get('/',function(req, res, next){
    getDataForIndex(1, function (err, result) {
        var recommend = result.recommend;
        var hotArticle = result.hotArticle;
        var articles = result.pageInfo.results;
        var page =  1;
        var count = result.pageInfo.count;
        var pageUrl = '/page/';
        var pageArr = [];
        for(var i = 1; i <= result.pageInfo.pageCount; i++){
            pageArr.push({pageNum: i, active: i==page ? 1 : 0, pageItemUrl: pageUrl + i});
        }
        if(err){
            next(err);
        }else{
            res.render('index',{
                recommend:recommend,
                hotArticle:hotArticle,
                articles:articles,
                count:count,
                page:1,
                pageCount:result.pageInfo.pageCount,
                pageUrl:pageUrl,
                pageArr:pageArr,
                layout: 'main'
            });
        }

    });
});

//首页分页
router.get('/page/:p',function(req, res, next){
    var page = parseInt(req.params.p);
    if(!page || isNaN(page) ) page = 1;
    getDataForIndex(page, function (err, result) {
        var recommend = result.recommend;
        var hotArticle = result.hotArticle;
        var articles = result.pageInfo.results;
        var count = result.pageInfo.count;
        var pageUrl = '/page/';
        var pageArr = [];
        for(var i = 1; i <= result.pageInfo.pageCount; i++){
            pageArr.push({pageNum: i,active: i == page ? 1 : 0, pageItemUrl: pageUrl + i});
        }
        if(err){
            next(err);
        }else{
            res.render('index',{
                recommend:recommend,
                hotArticle:hotArticle,
                articles:articles,
                count:count,
                page:page,
                pageCount:result.pageInfo.pageCount,
                pageUrl:pageUrl,
                pageArr:pageArr,
                layout: 'main'
            });
        }
    });
});

//分类展示
router.get('/c/:id',function(req, res, next){
    var cid = req.params.id;
    var page = req.query.page || 1;

    async.parallel({
        cat: function (done) {
            dbHelper.Category.findById(cid, function (err,doc) {
                done(err,doc);
            });
        },
        pages: function (done) {
            getPostsByCategory(cid, page, '',function (err, doc) {
                done(err,doc);
            })
        }
    },function (err, result) {
        var cat = result.cat;
        var articles = result.pages.results;
        var count = result.pages.count;
        var pageUrl = '/c/'+cat._id;
        var pageArr = [];
        for(var i = 1; i <= result.pages.pageCount; i++){
            pageArr.push({pageNum: i,active: i == page ? 1 : 0, pageItemUrl: pageUrl + '?page=' + i});
        }
        res.render('p/list',{
            articles:articles,
            cat:cat,
            pageArr:pageArr,
            page:page,
            pageUrl:pageUrl,
            pageCount:result.pages.pageCount,
            count:count,
            layout: 'main'
        });
    });
});

//关于我
router.get('/aboutme',function(req, res, next){
    res.render('me/aboutme',{layout: 'main'});
});

//搜索
router.get('/search/:keyword', function (req, res, next) {
    var keyword = req.params.keyword;
    var page = req.query.page || 1;

    getPostsByCategory('', page, keyword,function (err, doc) {
        //done(err,doc);
        var cat = {name:'搜索结果'};
        var articles = doc.results;
        var count = doc.count;
        var pageUrl = '/search';
        var pageArr = [];
        for(var i = 1; i <= doc.pageCount; i++){
            pageArr.push({pageNum: i, active: i == page ? 1 : 0, pageItemUrl: pageUrl + '?page=' + i});
        }
        res.render('p/list',{
            keyword:keyword,
            articles:articles,
            cat:cat,
            pageUrl:pageUrl,
            pageArr:pageArr,
            page:page,
            pageCount:doc.pageCount,
            count:count,
            layout: 'main'
        });
    });
});
//提交搜索
router.post('/search', function (req, res, next) {
    var keyword = req.body.keyword;
    res.redirect('/search/' + keyword);
});

//登录
router.get('/login', function (req, res) {
    res.render('login',{
        layout:'single'
    });
});
router.post('/login', function(req, res, next){
    var user = req.body;
    if(user.code == ''){
        req.flash(config.constant.flash.error,"验证码不能为空！");
        res.redirect('/login');
        return;
    }
    if(user.code.toLowerCase() != req.session.randomcode){
        req.flash(config.constant.flash.error,"验证码输入错误！");
        res.redirect('/login');
        return;
    }
    next();
}, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: '用户名或密码错误！'
}), function (req, res, next) {
    var username = req.body.username;
    dbHelper.User.findOne({username: username}).exec(function (err, user) {
        if(err){
            next(err);
        }else if(!user.status){
            req.flash(config.constant.flash.error,'大爷，你账户已经被禁用咯，请联系客服哦，好像没有客服，嘿嘿！');
            res.redirect('/login');
            return;
        }else{
            req.session.user = user;
            req.flash(config.constant.flash.success, '欢迎大爷回来，' + user.usernick);
            var url = user.role == config.constant.role.admin ? '/admin':'/';
            res.redirect(url);
            return;
        }
    })
});

router.get('/logout', function (req, res) {
    req.logOut();
    //res.clearCookie("meiluo");
    req.session.destroy();
    res.redirect('/');
});
router.get('/join', function (req, res, next) {
    res.render('join', {layout: 'single'});
});
router.post('/join', function (req, res, next) {
    var user = req.body;
    if(user.username == '' || user.password == ''){
        req.flash(config.constant.flash.error,"用户名和密码不能为空！");
        res.redirect('/join');
    }
    if(user.email == ""){
        req.flash(config.constant.flash.error,"邮箱不能为空！");
        res.redirect('/join');
    }
    if(user.password != user.confirm_password ){
        req.flash(config.constant.flash.error,"两次密码输入不一样！");
        res.redirect('/join');
    }
    if(user.code == ''){
        req.flash(config.constant.flash.error,"验证码不能为空！");
        res.redirect('/join');
    }
    if(user.code.toLowerCase() != req.session.randomcode){
        req.flash(config.constant.flash.error,"验证码输入错误！");
        res.redirect('/join');
    }
    next();
}, function (req, res, next) {
    var user = req.body;
    var User = dbHelper.User;
    async.parallel({
        username: function (done) {
            User.findOne({username:user.username}, function (err, doc) {
                done(err, doc);
            });
        },
        email: function (done) {
            User.findOne({email:user.email}, function (err, doc) {
                done(err,doc);
            });
        }
    }, function (err, result) {
        if(result.username){
            req.flash(config.constant.flash.error,"大爷，你的用户名已经被抢注了！");
            res.redirect('/join');
            return;
        }
        if(result.email){
            req.flash(config.constant.flash.error,"大爷，你的email已经被抢注了！");
            res.redirect('/join');
            return;
        }

        user.password = utils.md5(user.password, 'base64');
        User.create(user ,function (err, doc) {
            if(err){
                next(err);
            }else{
                req.flash(config.constant.flash.success, '注册成功，请登录!');
                res.redirect('/login');
            }
        })
    });
});

router.get('/u/:id', function (req, res, next) {
    var userId = req.params.id;
    dbHelper.User.findById(userId, function (err, doc) {
        if(err){
            next(err);
        }else{
            res.render("u/detail", {
                user:doc,
                layout: "main"
            })
        }
    });
});


module.exports = router;