/**
 * Created by Administrator on 2017/12/3.
 */
var Remarkable =  require('remarkable');
var hljs = require('highlight.js');

'use strict';

module.exports = {
    reshook: function (err, next, callback, errorCallback) {
        if(err){
            if(errorCallback){
                errorCallback();
            }else{
                err.status = 500;
                next(err);
            }
        }else{
            callback();
        }
    },
    Remarkable: function () {
        return new Remarkable('full', {
            linkify:true,
            highlight: function (str, lang) {
                if(lang && hljs.getLanguage(lang)){
                    try {
                        return hljs.highlight(lang,str).value;
                    }catch (err){}
                }
                try {
                    return hljs.highlightAuto(str).value;
                }catch (err){}

                return '';
            }
        });
    }
};