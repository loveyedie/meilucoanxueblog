/**
 * Created by Administrator on 2017/12/24.
 */
import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '../utils/auth'
import qs from 'qs';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})
console.log(process.env);
// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['M-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */

  const res = response.data;
  if (res.status === 0 || res.errorNum > 0 ) {
    Message({
      message: res.message,
      type: 'error',
      duration: 5 * 1000
    });

    return Promise.reject('error');
  } else {
    return res.result;
  }
}, error => {
  console.log('err' + error)// for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

const httpApi = (opts) => {
  let Public = { //公共参数
    'v': Date.now()
  }
  if (store.getters.token) {
    Public.token = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }

  let httpDefaultOpts = {
    method: opts.method || 'get',
    //baseURL: 'http://localhost/api',
    url: opts.url,
    params: Object.assign(Public, opts.data),
    data: qs.stringify(Object.assign(Public, opts.data)),
    headers: opts.method == 'get' ? {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'
    } : {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  };

  if(opts.method == 'get'){
    delete httpDefaultOpts.data;
  }else{
    delete httpDefaultOpts.params;
  }

  let httpPromise = new Promise((resolve, reject) => {

    service(httpDefaultOpts).then((res) => {
        console.log(res);
        resolve(res);
    }).catch((response) => {

      reject(response);
    });
  });
  return httpPromise;

}


export default httpApi
