/**
 * Created by Administrator on 2017/12/8.
 */


var path = require('path');
var express = require('express');
var router = express.Router();
var multer = require('multer');

var dbHelper = require('../../models/dbHelper');

var uploadObj = {
    userpic: {storage: 'userpic', filename: 'u'},
    category: {storage: 'category', filename: 'c'},
    article: {storage: 'article', filename: 'p'}
};
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadFrom = req.params.from;
        var uploadPath = './public/upload';
        if(uploadObj[uploadFrom]) uploadPath = uploadPath + '/' + uploadObj[uploadFrom].storage;
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        var uploadFrom = req.params.from;
        var filename  = 'pic';
        if(uploadObj[uploadFrom]) filename = uploadObj[uploadFrom].filename ;
        cb(null,filename + Date.now() + path.extname(file.originalname));
    }
});
var filter = function (req, file , cb) {
    var allowExts = ['.png', '.jpg', '.jpeg', '.gif'];
    var extname = path.extname(file.originalname);
    if(allowExts.join('#').indexOf(extname + '#')> -1){
        cb(null, true);
    }else{
        cb(null, false);
    }
};
var limits = {fileSize: 2 * 1024 * 1024};
var upload = multer({storage: storage, fileFilter: filter, limits: limits});

router.post('/:from', upload.single('avatar'), function (req, res, next) {
    var uploadFrom = req.params.from;
    var picUrl = '/upload';
    if(uploadObj[uploadFrom]) picUrl = picUrl + '/' + uploadObj[uploadFrom].storage;

    if(req.file){
        dbHelper.Picture.create({
            picurl: picUrl + '/' + req.file.filename,
            _user: req.session.user._id || '',
            picname: req.file.filename || '',
            picoriginname: req.file.originalname || '',
            usefor: uploadFrom
        },function (err, doc) {
            if(err){
                next(err);
            }else{
                res.json({
                    status: 1,
                    result: {
                        picId: doc._id || '',
                        picUrl: picUrl + '/' + req.file.filename
                    }
                });
            }
        });
    }else{
        res.json({status: 0, message: '大爷，不好意思，上传失败！'});
    }


});

router.get('/test', function (req, res, next) {
    res.render('test', {layout: 'main'});
});

module.exports = router;