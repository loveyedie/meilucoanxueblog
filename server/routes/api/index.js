/**
 * Created by Administrator on 2017/12/7.
 */
var express = require('express');
var router = express.Router();

var config = require('../../config');
var dbHelper = require('../../models/dbHelper');

var svgCaptcha = require('svg-captcha');

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

module.exports = router;