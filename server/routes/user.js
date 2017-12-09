/**
 * Created by Administrator on 2017/12/8.
 */
var express = require('express');
var router = express.Router();

var async = require('async');
var utils = require('utility');

var config = require('../config');
var dbHelper = require('../models/dbHelper');

router.get('/edit', function (req, res, next) {
   var user = req.session.user;
   res.render('u/edit', {
       user:user,
       layout:'main'
   });
});
router.post('/edit', function (req, res, next) {
    var user = req.body;
    if(user.email == ''){
        req.flash(config.constant.flash.error, "请输入邮箱！");
        res.redirect('/u/edit');
        return;
    }
    async.parallel({
        oldemail: function (done) {
            dbHelper.User.findOne({_id:user.id},function (err, doc) {
                done(null, doc.email);
            });
        },
        exitEmail :function (done) {
            dbHelper.User.findOne({email:user.email}, function (err,doc) {
                done(null,doc && doc.email);
            });
        }
    }, function (err, result) {
        if(result.exitEmail && result.exitEmail != result.oldemail){
            req.flash(config.constant.flash.error, "邮箱已被注册！");
            res.redirect('/u/edit');
            return;
        }
        if(user.newpassword) user.password = utils.md5(user.newpassword, 'base64');
        dbHelper.User.findOneAndUpdate({_id: user.id}, user, function (err, doc) {
            if(err){
                next(err);
            }else{
                req.session.user.usernick = user.usernick;
                req.session.user.userpic = user.userpic;
                req.session.user.signature = user.signature;
                req.session.save();
                req.flash(config.constant.flash.success, "信息修改成功！");
                res.redirect('/');
            }
        })
    });
});


module.exports = router;