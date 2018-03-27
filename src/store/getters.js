/**
 * Created by Administrator on 2017/12/24.
 */
const getters = {
    sidebar: state => state.app.sidebar,
    searchhistory: state => state.app.searchHistory,
    //language: state => state.app.language,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    userid: state => state.user.userId,
    username: state => state.user.userName,
    usernick: state => state.user.userNick,
    userpic: state => state.user.userPic,
    roles: state => state.user.roles,
    signature: state => state.user.userSignature,
    regtime: state => state.user.userRegTime,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    errorLogs: state => state.errorLog.logs
}
export default getters