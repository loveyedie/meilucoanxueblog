/**
 * Created by Administrator on 2017/12/17.
 */
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = 'http://localhost/api';

axios.interceptors.request.use(config => {
  //store.commit('UPDATE_LOADING',true); //显示loadding
  return config;
}, error => {
  return Promise.reject(eror);
});

axios.interceptors.response.use(response => {
  return response;
},error => {
  return Promise.resolve(error.response);
});

//错误处理
function errorState(response) {
  //store.commit('UPDATE_LOADING', false);
  console.log(response);
  // 如果http状态码正常，则直接返回数据
  if(response && (response.status === 200 || response.status === 304 || response.status === 400)){
    return response;
  }else{
    alert('大爷不好意思，网络出问题了！');

    /* 未兼容
    Vue.prototype.$msg.alert.show({
      title: '提示',
      content: '大爷不好意思，网络出问题了！'
    });*/
  }
}

function successState(res) {
  //store.commit('UPDATE_LOADING', false);
  //统一处理错误   跟后端协调
  return new Promise((resolve, reject) => {
    if(res.data.errorNum != '0'){
      alert(res.data.errMessage || '网络异常');
      reject(res.data);
      /*未兼容
       Vue.prototype.$msg.alert.show({
       title: '提示',
       content: res.data.errMessage || '网络异常',
       onShow(){},
       onHide(){
       console.log('关闭!');
       }
       });*/
    }else{
      resolve(res.data.result);
    }
  });

}

const httpApi = (opts, data) => {
  let Public = { //公共参数
    'v': Date.now()
  }

  let httpDefaultOpts = {
    method: opts.method || 'get',
    //baseURL: 'http://localhost/api',
    url: opts.url,
    timeout: 10000,
    params: Object.assign(Public, data),
    data: qs.stringify(Object.assign(Public, data)),
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
    axios(httpDefaultOpts).then((res) => {
      successState(res).then((result) => {
        resolve(result);
      });

    }).catch((response) => {
      errorState(response);
      reject(response);
    });
  });

  return httpPromise;

}

export default httpApi
