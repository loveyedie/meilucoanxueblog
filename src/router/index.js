import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
    // in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
    // detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

import Front from '../views/front/index.vue'
import Layout from '../views/layout/Layout'

//import HomePage from '@/page/Home';
//import CategoryPage from '@/page/Category';
//import PostPage from '@/page/Post';
//import UserPage from '@/page/User';

Vue.use(Router);

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [{
        path: '/',
        redirect: '/home',
        component: Front,
        hidden: true,
        children: [{
            name: 'home',
            path: '/home',
            component: _import('home/index')
        }, {
            path: '/c/:catid',
            component: _import('category/index'),
            name: 'category'
        }, {
            path: '/p/:postid',
            component: _import('post/index'),
            name: 'article'
        }, {
            path: '/search',
            component: _import('search/index'),
            name: 'search'
        }, {
            path: '/u/:userid',
            component: _import('user/index'),
            name: 'user'
        }]
    },
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/reg', component: _import('reg/index'), hidden: true },
    {
        path: '/admin',
        component: Layout,
        redirect: 'dashboard',
        children: [{
            path: 'dashboard',
            component: _import('dashboard/index'),
            name: 'dashboard',
            meta: { title: '管理首頁', icon: 'home', noCache: true }
        }]
    },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
    { path: '/404', component: _import('errorPage/404'), hidden: true }

]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

export const asyncRouterMap = [{
        path: '/admin/p',
        component: Layout,
        redirect: 'admin/p/index',
        name: 'post',
        meta: { title: '博文管理', icon: 'article', role: ['admin', 'reader'] },
        children: [{
            path: 'index',
            component: _import('admin/post/index'),
            name: 'post-list',
            meta: {
                title: '博文列表',
                role: ['admin', 'reader']
            }
        }, {
            path: 'post',
            component: _import('admin/post/detail'),
            name: 'post-ae',
            meta: {
                title: '博文添加/博文修改',
                //icon: 'edit',
                role: ['admin']
            }
        }]
    }, {
        path: '/admin/c',
        component: Layout,
        redirect: 'admin/c/index',
        name: 'category',
        meta: { title: '分类管理', icon: 'category', role: ['admin', 'reader'] },
        children: [{
            path: 'index',
            component: _import('admin/category/index'),
            name: 'category-list',
            meta: {
                title: '分类管理',
                icon: '',
                role: ['admin', 'reader']
            }
        }, {
            path: 'category',
            component: _import('admin/category/detail'),
            name: 'category-ae',
            meta: {
                title: '博文添加/博文修改',
                icon: '',
                role: ['admin']
            }
        }]
    }, {
        path: '/admin/u',
        component: Layout,
        redirect: 'admin/u/index',
        name: 'user',
        meta: { title: '用戶管理', icon: 'user', role: ['admin'] },
        children: [{
            path: 'index',
            component: _import('admin/user/index'),
            name: 'user-list',
            meta: {
                title: '用户管理',
                icon: '',
                role: ['admin']
            }
        }, {
            path: 'user',
            component: _import('admin/user/detail'),
            name: 'user-ae',
            meta: {
                title: '用户添加/用户修改',
                //icon: 'edit',
                role: ['admin']
            }
        }]
    }, {
        path: '/myinfo',
        component: Layout,
        children: [{
            path: 'index',
            component: _import('admin/me/index'),
            name: 'myinfo',
            meta: { title: '我的信息', icon: 'view', role: ['admin', 'reader'] }
        }]
    },

    /*
    {
      path: '/permission',
      component: Layout,
      redirect: '/permission/index',
      meta: { role: ['admin'] },
      children: [{
        path: 'index',
        component: _import('permission/index'),
        name: 'permission',
        meta: {
          title: 'permission',
          icon: 'lock',
          role: ['admin']
        }
      }]
    },*/

    {
        path: '/icon',
        component: Layout,
        children: [{
            path: 'index',
            component: _import('svg-icons/index'),
            name: 'icons',
            meta: { title: 'icons', icon: 'icon', noCache: true }
        }]
    },

    /*
    {
      path: '/components',
      component: Layout,
      redirect: 'noredirect',
      name: 'component-demo',
      meta: {
        title: 'components',
        icon: 'component'
      },
      children: [
        { path: 'tinymce', component: _import('components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
        { path: 'markdown', component: _import('components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
        { path: 'json-editor', component: _import('components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
        { path: 'dnd-list', component: _import('components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
        { path: 'splitpane', component: _import('components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
        { path: 'avatar-upload', component: _import('components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
        { path: 'dropzone', component: _import('components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
        { path: 'sticky', component: _import('components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
        { path: 'count-to', component: _import('components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
        { path: 'mixin', component: _import('components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
        { path: 'back-to-top', component: _import('components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }}
      ]
    },

    /*{
      path: '/charts',
      component: Layout,
      redirect: 'noredirect',
      name: 'charts',
      meta: {
        title: 'charts',
        icon: 'chart'
      },
      children: [
        { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
        { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
        { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
      ]
    },

    {
      path: '/example',
      component: Layout,
      redirect: '/example/table/complex-table',
      name: 'example',
      meta: {
        title: 'example',
        icon: 'example'
      },
      children: [
        {
          path: '/example/table',
          component: _import('example/table/index'),
          redirect: '/example/table/complex-table',
          name: 'Table',
          meta: {
            title: 'Table',
            icon: 'table'
          },
          children: [
            { path: 'dynamic-table', component: _import('example/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
            { path: 'drag-table', component: _import('example/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
            { path: 'inline-edit-table', component: _import('example/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
            { path: 'complex-table', component: _import('example/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
          ]
        },
        { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'tab' }}
      ]
    },

    {
      path: '/form',
      component: Layout,
      redirect: 'noredirect',
      name: 'form',
      meta: {
        title: 'form',
        icon: 'form'
      },
      children: [
        { path: 'create-form', component: _import('form/create'), name: 'createForm', meta: { title: 'createForm', icon: 'table' }},
        { path: 'edit-form', component: _import('form/edit'), name: 'editForm', meta: { title: 'editForm', icon: 'table' }}
      ]
    },*/
    /*
    {
      path: '/error',
      component: Layout,
      redirect: 'noredirect',
      name: 'errorPages',
      meta: {
        title: 'errorPages',
        icon: '404'
      },
      children: [
        { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
        { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
      ]
    },

    {
      path: '/error-log',
      component: Layout,
      redirect: 'noredirect',
      children: [{ path: 'log', component: _import('errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
    },

    {
      path: '/excel',
      component: Layout,
      redirect: '/excel/export-excel',
      name: 'excel',
      meta: {
        title: 'excel',
        icon: 'excel'
      },
      children: [
        { path: 'export-excel', component: _import('excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
        { path: 'export-selected-excel', component: _import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
        { path: 'upload-excel', component: _import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
      ]
    },

    {
      path: '/zip',
      component: Layout,
      redirect: '/zip/download',
      children: [{ path: 'download', component: _import('zip/index'), name: 'exportZip', meta: { title: 'exportZip', icon: 'zip' }}]
    },

    {
      path: '/theme',
      component: Layout,
      redirect: 'noredirect',
      children: [{ path: 'index', component: _import('theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
    },

    {
      path: '/clipboard',
      component: Layout,
      redirect: 'noredirect',
      children: [{ path: 'index', component: _import('clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
    },

    {
      path: '/i18n',
      component: Layout,
      children: [{ path: 'index', component: _import('i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
    },*/

    { path: '*', redirect: '/404', hidden: true }
]
