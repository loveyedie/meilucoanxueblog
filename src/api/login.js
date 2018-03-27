/**
 * Created by Administrator on 2017/12/24.
 */
import request from '../utils/request'

export function userLogin(username, password, code) {
  const data = {
    username,
    password,
    code
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
