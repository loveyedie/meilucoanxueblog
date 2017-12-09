/**
 * Created by Administrator on 2017/12/1.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('utility');
var Promise = require('bluebird');
var async = require('async');
var config = require('../config');

/**
 *  站点用户
 *  @private
 */
var _getUser = function () {
    /*用户定义*/
    var userSchema = new Schema({
        username: {type: String, required: true, unique: true},   //用户名
        password: {type: String, required: true},
        role: {type: String, default: config.constant.role.user}, //角色：admin  user(默认)
        usernick:{type:String,default:"大爷"},   //昵称
        userpic:{type: String,default:"/upload/userpic/default.jpg"},  //头像
        sex:{type:String,default:"秘密"},
        age:{type:Number,default:"18"},
        email: {type: String},  //邮箱
        mobile:{type: String}, //手机
        website:{type: String},  //网站
        weibo: {type: String},  //微博
        address: {type: String},  //地址
        github: {type: String},  //github
        signature: {type: String, default: '小样，新来的吧'},  //签名
        job: {type: String},  //工作
        status: {type: Boolean, default:true}  //用户是否有效
    },{
        timestamps:{
            createdAt: 'created_at',
            updatedAt: 'update_at'
        }
    });
    userSchema.methods.validPassword = function (password) {
        return utils.md5(password, 'base64') === this.password;
    }
    var User = mongoose.model('User',userSchema,'user');

    User.count({},function(err,count){
        if(err) return console.error(err);
        //console.log(count);
        if(count < 1){
            User.create({
                username:"admin",
                usernick:"超tm管",
                password:utils.md5("admin123456", 'base64'),
                role:"admin"
            },function(err,user){
                if(err) return console.error(err);
                //console.log(user);
            });
        }
    });

    return Promise.promisifyAll(User);
};

var _getCategory = function () {
  /*分类定义*/
  var categorySchema = new Schema({
      name:{type:String, required:true},
      catpic:{type:String, default:'/upload/category/cat-default.jpg'},
      order:{type:Number,default:1},
      status:{type:Boolean, default:true}
  },{timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});
  //var Category = mongoose.models('Category', categorySchema, 'category');
  //return Promise.promisifyAll(Category);
    return mongoose.model('Category', categorySchema, 'category');
};

var _getArticle = function () {
    /*文章评论定义*/
    var commentSchema = new Schema({
        _user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        content:{type: String,required: true}
    },{
        timestamps: {createdAt:'created_at',updatedAt:'updated_at'}
    });

    /*文章定义*/
    var articleSchema =  new Schema({
        title: {type: String, required:true},
        description: {type: String},
        content: {type:String},
        picurl: {type: String},
        up: {type: Boolean,default:false},
        recommend: {type:Boolean, default: false},
        html:{type: String},
        index:{type: String},
        views:{type:Number, default: 0},
        favorite: {type: Number, default: 0},
        type: {type: String,default: '原创'},
        _category: {
            type: Schema.Types.ObjectId,
            ref:'Category'
        },
        created_time:{type: Date,default:Date.now},
        updated_time:{type: Date,default:Date.now},
        url:{type:String},
        source:{type:String},
        source_id:{type:String},
        tags:{type: Array,default: []},
        _user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        comments:[commentSchema]
    },{
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    });
    articleSchema.methods.iaShared = function () {
        return this.type == '分享';
    };
    var Article = mongoose.model('Article',articleSchema,'article');
    return Promise.promisifyAll(Article);
};

/**
 * 图片库
 * */
var _getPicture = function () {
    /*分类定义*/
    var picturesSchema = new Schema({
        picurl:{type:String, required:true},
        _user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        picname:{type: String},
        picoriginname:{type: String},           //图片原来名字
        usefor:{type: String},     //1,用户图像; 2,分类图片;3,图片缩略图;4,other
        _article: {
            type: Schema.Types.ObjectId,
            ref:'Article'
        },
        order:{type:Number,default:1},
        status:{type:Boolean, default:true}
    },{timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});
    //var Category = mongoose.models('Category', categorySchema, 'category');
    //return Promise.promisifyAll(Category);
    return mongoose.model('Picture', picturesSchema, 'picture');
};

/**
 * 对分页进行封装
 * @param page 当前页码，从1开始
 * @param pageSize 一页多少记录
 * @param Model Mongoose Model
 * @param populate populate参数
 * @param queryParams 查询参数
 * @param sortParams 排序参数
 * @param callback 回调函数
 * */
var pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {pageNumber: page};
    async.parallel({
        count: function (done) {
            Model.count(queryParams).exec(function (err, count) {
                done(err,count);
            });
        },
        records: function (done) {
            Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            })
        }
    },function (err, results) {
        var count = results.count;
        $page.pageCount = parseInt((count - 1) / pageSize + 1);
        $page.results = results.records;
        $page.count = count;
        callback(err, $page);
    })
};

module.exports = {
    User: _getUser(),
    Category: _getCategory(),
    Article: _getArticle(),
    Picture: _getPicture(),
    Methods:{
        pageQuery: pageQuery
    }
};