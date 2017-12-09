/**
 * Created by Administrator on 2017/12/2.
 */
var dbHelper = require('./dbHelper');

module.exports = {
    findArticleByUser: function (userId,callback) {
        var Article = dbHelper.Article;
        Article.find({_user: userId}).sort({'created_time':'desc'}).then(function (doc) {
            callback(doc);
        });
    },
    findArticleByCategory: function (catId,callback) {
        var Article = dbHelper.Article;
        Article.find({_category: catId}).sort({'created_time':'desc'}).then(function (doc) {
            callback(doc);
        });
    },
    saveOrUpdate: function (article,callback) {
        var Article = dbHelper.Article;
        if(article.id){
            article.updated_time = new Date();
            Article.update({
                _id:article.id
            },article,function (err,doc) {
                callback(err, doc);
            });
        }else{
            Article.create(article,function (err, doc) {
                callback(err, doc);
            });
        }
    }
};