/**
 * Created by Administrator on 2017/12/3.
 */
var dbHelper = require('./dbHelper');
var Category = dbHelper.Category;

module.exports = {
    findCategoryAll: function (callback) {
        Category.find({}).sort({'order':'desc'}).then(function (doc) {
            callback(doc);
        })
    },
    findCategoryByID: function (id, callback) {
        Category.find({_id:id}).then(function (doc) {
            callback(doc);
        })
    },
    saveOrUpdateCategory: function (cat, callback) {
        if(cat.id){
            Category.update({_id:cat.id},cat,function (err,doc) {
                callback(err,doc);
            })
        }else{
            Category.create(cat, function (err, doc) {
                callback(err,doc);
            })
        }
    }
};