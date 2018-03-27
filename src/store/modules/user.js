/**
 * Created by Administrator on 2017/12/24.
 */
import { userLogin, logout, getUserInfo } from '../../api/login'
import { getToken, setToken, removeToken } from '../../utils/auth'

const user = {
  state: {
    userId: '',
    userName: '',
    userNick: '',
    userPic: '',
    token: getToken(),
    roles: [],
    userSignature: '',
    userRegTime: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_USERNICK: (state, userNick) => {
      state.userNick = userNick
    },
    SET_USERPIC: (state, userPic) => {
      state.userPic = userPic
    },
    SET_USERSIGNATURE: (state, signature) => {
      state.userSignature = signature
    },
    SET_USERREGTIME: (state, regTime) => {
      state.userRegTime = regTime
    },
    SET_ROLES: (state, role) => {
      if(state.roles.indexOf(role) == -1) state.roles.push(role)
    }
  },

  actions: {
    // 用户名登录
    UserLoginForm({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        userLogin(username, userInfo.password, userInfo.code).then(response => {
          const token = response.token
          commit('SET_TOKEN', token)
          setToken(token)
          resolve(token)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const currentUser = response.data
          commit('SET_ROLES', currentUser.userRole)
          commit('SET_USERID', currentUser.userId)
          commit('SET_USERNAME', currentUser.userName)
          commit('SET_USERNICK', currentUser.userNick)
          commit('SET_USERPIC', currentUser.userPic)
          commit('SET_USERSIGNATURE', currentUser.userSignature)
          commit('SET_USERREGTIME', currentUser.introduction)
          resolve(currentUser)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}
export default user
