/**
 * Created by Administrator on 2017/12/7.
 */
var express = require('express');
var router = express.Router();
var async = require("async");

var config = require('../../config');
var dbHelper = require('../../models/dbHelper');

var svgCaptcha = require('svg-captcha');

var userLoginApi = require('./login/index');

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

  dbHelper.Methods.pageQuery(page,pageSize,Article,'_user _category',queryParams,{'created_time':'desc'},function (err, pageInfo) {
    callback(err,pageInfo);
  });
}

router.get('/u', function (req, res, next) {
    var userName = req.query.username;
    var email = req.query.email;
    var code = req.query.code;
    var queryParam = {};
    if(userName) queryParam.username = userName;
    if(email) queryParam.email = email;
    if(code){
        var status = code.toLowerCase() == req.session.randomcode ? 0 : 1;
        res.json({status: status});
        return;
    }
    dbHelper.User.findOne(queryParam,function (err, doc) {
        if(doc){
            res.json({
                status: 1,
                errorNum: 0,
                result: {
                    total: 1,
                    data: {
                        _id: doc._id,
                        username: doc.username,
                        email: doc.email
                    }
                }
            });
        }else{
            res.json({status:0,errorNum:100,message:"没有数据"});
        }
    })
});

router.get('/code', function (req, res, next) {
    // 验证码，对了有两个属性，text是字符，data是svg代码
    var code = svgCaptcha.create({
        inverse: false,// 翻转颜色

        fontSize: 36,// 字体大小
        noise: 3,// 噪声线条数
        width: 80,// 宽度
        height: 34, // 高度
        color: '#000',
        background: '#cc9966'
    });
    // 保存到session,忽略大小写
    req.session["randomcode"] = code.text.toLowerCase();
    // 返回数据直接放入页面元素展示即可
    //res.send(code.data);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.write(String(code.data));
    res.end();
})

router.get('/category', function (req, res, next) {
  var cid = req.query.catId || '';
  var page = req.query.page || 1;

  async.parallel({
    cat: function (done) {
      if(cid){
        dbHelper.Category.findById(cid, function (err,doc) {
          done(err,doc);
        });
      }else{
        done(null,'');
      }

    },
    pages: function (done) {
      getPostsByCategory(cid, page, '',function (err, doc) {
        done(err,doc);
      })
    }
  },function (err, result) {
    if(err){
      res.json({status:0,errorNum:100,message:"没有数据"});
    }else{
      var cat = result.cat;
      var articles = result.pages.results;
      var count = result.pages.count;
      var pageUrl = '/c/'+cat._id;
      var pageArr = [];
      for(var i = 1; i <= result.pages.pageCount; i++){
        pageArr.push({pageNum: i,active: i == page ? 1 : 0, pageItemUrl: pageUrl + '?page=' + i});
      }
      res.json({
        status: 1,
        errorNum: 0,
        result: {
          articles:articles,
          cat:cat,
          pageArr:pageArr,
          page:page,
          pageUrl:pageUrl,
          pageCount:result.pages.pageCount,
          count:count,
        }
      });
    }

  });
})

router.post('/login/login', function (req, res, next) {
  userLoginApi.userLogin(req, res, next);
});
router.post('/login/logout', function (req, res, next) {
  userLoginApi.userLogout(req, res, next);
});
router.get('/user/info', userLoginApi.getUserInfo);

module.exports = router;
