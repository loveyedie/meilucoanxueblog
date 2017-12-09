/**
 * Created by Administrator on 2017/11/21.
 */
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var flash = require('connect-flash');
var passport  = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var ejs = require('ejs');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');

var config = require('./config');
var authority = require('./lib/authority');
var dbHelper = require('./models/dbHelper');
var hbshelper = require('./lib/hbsHelper');

var index = require('./routes/index');
var article = require('./routes/article');
var userinfo = require('./routes/user');
var admin = require('./routes/admin/index');
var adminUser = require('./routes/admin/user');
var manageArticle = require('./routes/admin/article');
var manageCategory = require('./routes/admin/category');
var api = require('./routes/api/index');
var upload = require('./routes/upload/index');

//登录passport
passport.use(new LocalStrategy(function (username, password, done) {
    dbHelper.User.findOne({username:username}, function (err, user) {
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false);
        }
        if(!user.validPassword(password)){
            return done(null, false);
        }
        return done(null, user);
    })
}));

passport.serializeUser(function (user , done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null,id);
});


var app = express();

//数据库连接
//mongoose.connect('mongodb://127.0.0.1:27017/loveyedie');
//mongoose.connect('mongodb://127.0.0.1:27017/loveyedie',{useMongoClient: true});

mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success.")
});
mongoose.connection.on("error", function (err) {
    console.log(err);
    console.log("MongoDB connected fail.")
});
mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnected.")
});

try {
    mongoose.connect(config.db.url,{useMongoClient: true});
} catch (error) {
    console.log(error);
}

var hbs = exphbs.create({
    partialsDir: 'views/partials',
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main',
    extname: '.html',
    helpers: hbshelper
});

//view engine setup
app.set('views',path.join(__dirname, 'views'));
app.engine('.html',hbs.engine);
app.set('view engine','html');

//app.engine('.html',ejs.__express);
//app.set('view engine','html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: config.db.cookieSecret,
    cookie: {maxAge : 30 * 60 *1000}
}));
//passport
app.use(passport.initialize());
app.use(passport.session());

/*app.use(function(req,res,next){
 if(req.cookies.userId){
 next();
 }else{
 console.log("url:" + req.originalUrl);
 res.json({
 status:'10001',
 msg:'当前未登录',
 result:''
 })
 }
 });*/

/**
 * 服务器跨域
 * */
/*app.all('*', function (req, res, next) {
    //CORS
    res.header("Access-Control-Allow-Origin","http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Control-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", "3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});*/

/**
 * 全局参数传递
 * */
app.use(function (req, res, next) {
   res.locals.site = config.site;
   res.locals.success = req.flash(config.constant.flash.success);
   res.locals.error = req.flash(config.constant.flash.error);
   res.locals.session = req.session;
    res.locals.nowtime = new Date().getTime();
   dbHelper.Category.find({status:true}).exec(function (err,doc) {
       if(err){
           next(err);
       }else{
           res.locals.cats = doc;
           next();
       }
   });
});



app.use('/', index);
app.use('/p', article);

app.use('/user', authority.isAuthenticated, userinfo);
app.use('/uploadfile', authority.isAuthenticated, upload);

//api
app.use('/api', api);
//admin
app.use('/admin', authority.isAdmin, admin);
//文章管理路由
app.use('/admin/p', authority.isAdmin, manageArticle);
//用户管理路由
app.use('/admin/u', authority.isAdmin, adminUser);
//分类管理路由
app.use('/admin/category', authority.isAdmin, manageCategory);


//404
app.use(function(req, res, next){
   var err = new Error('大爷，没找到地啊！');
   err.state = 404;
   //next(err);
   res.render('404',{message:err.message});
});

//error handler
app.use(function(err, req, res, next){
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error:err
    });
});

module.exports = app;