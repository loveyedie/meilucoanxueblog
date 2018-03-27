/**
 * Created by Administrator on 2017/12/24.
 */
module.exports = file => () =>
    import ('../../src/views/' + file + '.vue')