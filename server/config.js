/**
 * Created by Administrator on 2017/12/2.
 */
var Config = {
    site:{
        title:'梅落残雪',
        description:'博客，学习历程，技术展示，个人相关，自己路自己走',
        version:'1.0.0'
    },
    db:{
        cookieSecret: 'meiluocanxueblogsecret',
        name:'loveyedie',
        host:'www.loveyedie.xin',
        url:'mongodb://loveyedie:meiluocanxue@dds-bp1ddbe00dfdb9041.mongodb.rds.aliyuncs.com:3717/loveydie'
        //url: 'mongodb://127.0.0.1:27017/loveyedie'
    },
    constant:{
        flash:{
            success: 'success',
            error: 'error'
        },
        role:{
            admin:'admin',
            user: 'user'
        }
    },
    article:{
        pageSize:2,
        type:['原创','分享']
    }
};
module.exports = Config;