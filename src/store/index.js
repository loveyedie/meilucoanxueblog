/**
 * Created by Administrator on 2017/12/17.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLogs'
import permission from './modules/permission'
import tagsView from './modules/tagViews'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        errorLog,
        permission,
        tagsView,
        user
    },
    getters
})

export default store