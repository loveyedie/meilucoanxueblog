/**
 * Created by Administrator on 2017/12/2.
 */
var express = require('express');
var router = express.Router();

var utils = require('utility');
var config = require('../../config');
var dbHelper = require('../../models/dbHelper');
var webHelper = require('../../lib/webHelper');

var User = dbHelper.User;

//用户列表
router.get('/', function (req, res, next) {
    User.find({}).exec(function (err,doc) {
        if(err){
            next(err);
        }else{
            res.render('admin/u/list', {
                users:doc,
                menu:'u-list',
                layout:'manage'
            });
        }
    });
});

//添加用户
router.get('/create', function (req, res, next) {
    res.render('admin/u/create', {menu:'u-create',layout:'manage'});
});

//提交添加用户
router.post('/create', function (req, res, next) {
    var user = req.body;
    if(user.id){
        if(user.newPassword) user.password = utils.md5(user.newPassword, 'base64');
        User.findOneAndUpdate({_id: user.id}, user, function (err,doc) {
            webHelper.reshook(err, next, function () {
                req.flash(config.constant.flash.success,"用户修改成功！");
                res.redirect('/admin/u');
            });
        });
    }else{
        user.password = utils.md5(user.newPassword, 'base64');
        User.create(user, function (err,doc) {
            webHelper.reshook(err, next, function () {
                req.flash(config.constant.flash.success,'用户添加成功！');
                res.redirect('/admin/u');
            });
        });
    }
});

//删除用户
router.get('/delete/:id', function (req, res,next) {
    var id = req.params.id;
    User.findById(id, function (err,doc) {
        if(doc){
            doc.remove(function (err, doc) {
                webHelper.reshook(err, next, function () {
                    req.flash(config.constant.flash.success,'用户删除成功！');
                    res.redirect('/admin/u');
                })
            })
        }else{
            next(err);
        }
    });
});

//修改用户
router.get('/edit/:id', function (req, res, next) {
    var id = req.params.id;
    User.findById(id, function (err, doc) {
        if(err){
            next(err);
        }else{
            res.render('admin/u/create', {user: doc, menu:'u-create', layout: 'manage'});
        }
    })
});

//禁用用户
router.get('/disabled/:id', function (req, res, next) {
    var id = req.params.id;
    var status = req.query.status;
    status = status && status == 'true'? false : true;
    User.update({_id: id}, {status: status}, function (err, doc) {
        webHelper.reshook(err, next, function () {
            res.redirect('/admin/u');
        })
    });
});

//用户升管
router.get('/up/:id',function (req, res, next) {
    var id = req.params.id;
    var role = req.query.role;
    role = role == 'admin' ? 'user' : 'admin';
    User.update({_id: id}, {role: role}, function (err,doc) {
        webHelper.reshook(err, next, function () {
            res.redirect('/admin/u');
        })
    });
});



module.exports = router;