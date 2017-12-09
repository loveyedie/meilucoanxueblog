/**
 * Created by Administrator on 2017/11/24.
 */
var mongoose = require('mongoose');

//mongoose.connect('mongodb://127.0.0.1:27017/loveyedie');
mongoose.connect('mongodb://127.0.0.1:27017/loveyedie',{useMongoClient: true});

var userSchema  = new mongoose.Schema({
    "userId":{type:String},
    "userName":{type:String,default:"",required:true},
    "userNick":{type:String,default:"懒人"},
    "userPwd":String,
    "sex":{type:String,default:"秘密"},
    "age":{type:Number,default:"18"},
    "regDate":{type:Date,default:Date.now()}
});




//test  learn
var userModel = mongoose.model("User",userSchema,'user');

userModel.count({},function(err,count){
    if(err) return console.error(err);
    console.log(count);
    if(count < 1){
        userModel.create({userName:"admin",userNick:"超管",userPwd:"admin456"},function(err,user){
            if(err) return console.error(err);
            console.log(user);
        });
    }
});
module.exports = userModel;