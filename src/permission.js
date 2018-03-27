/**
 * Created by Administrator on 2017/12/24.
 */
import router from './router';
import store from './store';
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

import { getToken } from './utils/auth' //验权
import { Message } from 'element-ui'

// permissiom judge
function hasPermission(roles, permissionRoles) {
    if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
    if (!permissionRoles) return true
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/', '/home', '/c/', '/search', '/p/', '/u/', '/login', '/reg', ] // 不重定向白名单


router.beforeEach((to, from, next) => {

    if (getToken()) {
        if (to.path === '/login') {
            next({ path: '/' });
            NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        } else {
          console.log(store)
            if (store.getters.roles && store.getters.roles.length > 0) {
              // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
              if (hasPermission(store.getters.roles, to.meta.role)) {
                next() //
              } else {
                next({ path: '/401', query: { noGoBack: true } })
                NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
              }
              // 可删 ↑
            } else {
              store.dispatch("GetUserInfo").then(res => {
                const roles = res.userRole;
                store.dispatch('GenerateRoutes',  roles ).then(() => { // 生成可访问的路由表
                  router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                  next({...to, replace: true }) // hack方法 确保addRoutes已完成 ,replace: true so the navigation will not leave a history record
                })
              }).catch(() => {
                store.dispatch('FedLogOut').then(() => {
                  Message.error('验证失败,请重新登录')
                  next({ path: '/login' })
                })
              })
            }
        }
    } else {
        let exitedPath = to.path.indexOf('/c/') >= 0 || to.path.indexOf('/u/') >= 0 || to.path.indexOf('/p/') >= 0
        if (exitedPath || whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login') // 否则全部重定向到登录页
            NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
    }
});

router.afterEach(() => {
    NProgress.done() // 结束Progress
})
