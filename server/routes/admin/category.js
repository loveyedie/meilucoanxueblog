/**
 * Created by Administrator on 2017/12/3.
 */
var express = require('express');
var router = express.Router();

var config = require('../../config');
var webHelper = require('../../lib/webHelper');
var dbHelper = require('../../models/dbHelper');
var Category = dbHelper.Category;
var categoryDao = require('../../models/categoryDao');

//分类管理
router.get('/', function (req, res) {
    categoryDao.findCategoryAll(function (categories) {
        console.log(categories);
        res.render('admin/cat/list', {
            categories: categories,
            menu: 'cat-list',
            layout: 'manage'
        });
    });
});

//添加分类
router.get('/create', function (req, res) {
    res.render('admin/cat/create',{menu:'cat-create',layout:'manage'});
});

router.post('/create', function (req,res,next) {
    var category = req.body;
    categoryDao.saveOrUpdateCategory(category,function (err, doc) {
        webHelper.reshook(err, next, function () {
            req.flash(config.constant.flash.success,'分类添加成功！');
            res.redirect('/admin/category');
        });
    })
});

router.get('/delete/:id', function (req, res, next) {
    var id  = req.params.id;
    Category.findById(id,function (err, doc) {
        if(doc){
            doc.remove(function (err, doc) {
                webHelper.reshook(err,next,function () {
                    req.flash(config.constant.flash.success, '分类删除成功！');
                    res.redirect('/admin/category');
                });
            });
        }else{
            next(err);
        }
    });
});

router.get('/edit/:id', function (req, res, next) {
    var id = req.params.id;
    Category.findById(id, function (err, doc) {
        if(doc){
            res.render('admin/cat/create', {
                category:doc,
                menu:'cat-list',
                layout:'manage'
            });
        }else{
            next(err);
        }
    })
});

router.get('/disable/:id', function (req, res, next) {
    var id = req.params.id;
    var status = req.query.disable;
    status = status && status == 'true' ? false : true;
    Category.update({_id: id},{status: status}, function (err , raw) {
        if(err){
            next(err);
        }else{
            res.redirect('/admin/category');
        }
    });
});

module.exports = router;

