/**
 * Created by Administrator on 2017/12/2.
 */
var express = require('express');
var router = express.Router();
//var dbHelper = require('../../models/dbHelper');

router.get('/', function (req, res) {
    res.render('admin/index', {menu: 'index',layout: 'manage'});
});

router.get('/me', function (req, res, next) {
    var user = req.session.user;
    res.render('admin/u/create', {
        user:user,
        menu:'me',
        layout:'manage'
    });
})

module.exports = router;