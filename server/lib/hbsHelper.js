/**
 * Created by Administrator on 2017/12/3.
 */
var moment = require('moment');

'use strict';

moment.locale('zh-cn');

module.exports = {
    /**
     * 定义局部文件
     * @param name
     * @param block
     * @return {null}
     * */
    section: function (name,block) {
        if(!this._sections) this._sections = {};
        this._sections[name] = block.fn(this);
        return null;
    },
    /**
     * 自动截取文章摘要
     * @param content
     * */
    articleDesc: function (content) {
        if(!content) content = '';
        var re = /<[^>]+>/gi;
        var str = content.replace(re, '');
        return str.substr(0,100);
    },
    /**
     * 时间格式化显示
     * */
    timeFromNow: function (date) {
        return moment(date).fromNow();
    },
    /**
     * +1
     * @param index
     * @return {*}
     * */
    addOne: function (index) {
        return index + 1;
    },
    add: function (value1, value2) {
        return Number(value1) + Number(value2);
    },
    reduce: function (value1, value2) {
        return Number(value1) - Number(value2);
    },
    /**
     * 格式化日期
     * @param date
     * @param fmt
     * @return {*}
     * */
    formatDate: function (date, fmt) {
        if(date == undefined)  return;
        var o = {
            "M+": date.getMonth() + 1,                      //月份
            "d+": date.getDate(),                           //日
            "h+": date.getHours(),                          //小时
            "m+": date.getMinutes(),                        //分钟
            "s+": date.getSeconds(),                        //秒
            "q+": Math.floor((date.getMonth() + 3) / 3),    //季度
            "S+": date.getMilliseconds()                    //毫秒
        };
        if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1,(date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o){
            if(new RegExp("(" + k + ")").test(fmt)){
                fmt = fmt.replace(RegExp.$1,(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    /**
     * 转数字
     * @param value
     * */
    number: function (value) {
        return Number(value);
    },
    /**
     * 判断相等
     * @param value1
     * @param value2
     * @param options
     * @return {*}
     * */
    equals: function (value1, value2, options) {
        if(Number(value1)) value1 = Number(value1);
        if(Number(value2)) value2 = Number(value2);
        if(value1 == value2){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    },
    /**
     * 遍历数字
     * @param n
     * @param block
     * @returns {string}
     * */
    times: function (n, begin,end,block) {
        if(!begin) begin = 0;
        if(!end) end = n - 1;
        var accum = '';
        for (var i = begin; i <= end; i++){
            this.step = i;
            accum += block.fn(this);
        }
        return accum;
    },

    /**
     * 小于
     * @param value1
     * @param value2
     * @param block
     */
    lt: function (value1, value2, block) {
        if (Number(value1) < Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    /**
     * 小于等于
     * @param value1
     * @param value2
     * @param block
     */
    le: function (value1, value2, block) {
        if (Number(value1) <= Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    /**
     * 大于
     * @param value1
     * @param value2
     * @param block
     */
    gt: function (value1, value2, block) {
        if (Number(value1) > Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    /**
     * 大于等于
     * @param value1
     * @param value2
     * @param block
     */
    ge: function (value1, value2, block) {
        if (Number(value1) >= Number(value2)) {
            return block.fn(this);
        } else {
            return block.inverse(this);
        }
    },
    contains: function (array,value,option) {
        array = (array instanceof Array) ? array : [array];
        return (array.indexOf(value) > -1) ? option.fn(this) : option.inverse(this);
    }
};