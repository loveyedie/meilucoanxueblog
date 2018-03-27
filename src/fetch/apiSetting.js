/**
 * Created by Administrator on 2017/12/17.
 */
const serviceModule = {
  checkUserLogin:{
    url: '/checklogin',
    method: 'get'
  },
  userLogin: {
    url: '/login',
    method: 'post'
  },
  userReg: {
    url: '/userreg',
    method: 'post'
  },
  getPostList: {
    url: '/category',
    method: 'get'
  }
}

const ApiSetting = {...serviceModule};

export default ApiSetting
