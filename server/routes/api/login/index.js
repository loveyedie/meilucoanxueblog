/**
 * Created by Administrator on 2017/12/24.
 */
var async = require("async");
var utils = require('utility');

var config = require('../../../config');
var dbHelper = require('../../../models/dbHelper');

var userLogin = function (req, res, next) {
  var loginUser = req.body;
  if(loginUser.username === ''){
    res.json({status:0,errorNum:100,message:"大爷，你没填用户名啊!"});
    return;
  }
  if(loginUser.password === ''){
    res.json({status:0,errorNum:100,message:"大爷，你没填密码啊!"});
    return;
  }

  if(loginUser.code === ''){
    res.json({status:0,errorNum:100,message:"验证码不能为空!"});
    return;
  }
  if(loginUser.code.toLowerCase() !== req.session.randomcode){
    res.json({status:0,errorNum:100,message:"验证码输入错误!"});
    return;
  }
  dbHelper.User.findOne({username: loginUser.username}).exec(function (err, user) {
    if(err){
      next(err);
    }else if(!user){
      res.json({status:0,errorNum:100,message:"大爷，没你这个号!"});
    }else if(utils.md5(loginUser.password, 'base64') !== user.password){
      res.json({status:0,errorNum:100,message:"大爷，你是不是忘记密码了，这个是错的!"});
    }else if(!user.status){
      res.json({status:0,errorNum:100,message:"大爷，你账户已经被禁用咯，请联系客服哦，好像没有客服，嘿嘿!"});
    }else{
      req.session.user = user;
      var token = user._id + config.db.cookieSecret + '' + Date.now();
      res.json({status: 1,errorNum: 0,result: {token: token}});
    }
  })

};


var userLogout = function (req, res, next) {
  req.logOut();
  req.session.destroy();
  res.json({status: 1,errorNum: 0,info: '大爷，你已登出！'});
};

var getUserInfo = function (req, res, next) {
  var token = req.query.token;
  var userId = req.query.userid;
  if(!token && !userId){
    res.json({status: 0,errorNum: 100,info: '没有参数！'});
  }else if(token && token.indexOf(config.db.cookieSecret) === -1){
    res.json({status: 0,errorNum: 100,info: '参数无效！'});
  }else{
    var _userId = token ? token.split(config.db.cookieSecret)[0] : userId;
    dbHelper.User.findById(_userId, function (err, doc) {
      if(err){
        next(err);
      }else{
        if(doc){
          res.json({
            status: 1,
            errorNum: 0,
            result:{
              total: 1,
              data: {
                userId: doc._id,
                userName: doc.username,
                userNick: doc.usernick,
                userPic: doc.userpic,
                userRole: doc.role,
                userSignature: doc.signature,
                userRegDate: doc.createdAt
              }
            }
          })
        }else{
          res.json({status: 0,errorNum: 100,info: '没找到用户！'});
        }
      }
    })
  }
}

module.exports = {
  userLogin: userLogin,
  userLogout: userLogout,
  getUserInfo: getUserInfo
}
