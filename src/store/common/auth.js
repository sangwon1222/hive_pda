import AuthApi from '@/services/auth'
import jwtDecode from 'jwt-decode'
const user = JSON.parse(localStorage.getItem('username'))

const initialState = user
  ? { loggedIn: true, user }
  : { loggedIn: false, user: null }

const Auth = {
  namespaced: true,
  state: initialState,
  actions: {
    async signin({ commit }, user) {
      try {
        const {
          data: { jwtToken, refreshToken },
        } = await AuthApi.signin(user)
        const warehouseList = jwtDecode(jwtToken).warehouseList

        commit('signinSuccess', {
          jwtToken,
          refreshToken,
          username: user.email,
          warehouseList,
        })
      } catch (e) {
        commit('signinFail')
      }
    },
    async signout({ commit }) {
      await AuthApi.signout()
      commit('signout', user)
    },
  },
  mutations: {
    signinSuccess(state, { jwtToken, refreshToken, username, warehouseList }) {
      if (jwtToken) {
        state.user = username
        state.loggedIn = true
        localStorage.setItem('token', JSON.stringify(jwtToken))
        localStorage.setItem('refresh', JSON.stringify(refreshToken))
        localStorage.setItem('loggedIn', JSON.stringify(true))
        localStorage.setItem('username', JSON.stringify(username))
        localStorage.setItem('warehouseList', JSON.stringify(warehouseList))
      }
    },
    signinFail(state) {
      localStorage.clear()
      state.loggedIn = false
      localStorage.setItem('loggedIn', JSON.stringify(false))
    },
    signout(state) {
      localStorage.clear()
      state.loggedIn = false
      localStorage.setItem('loggedIn', JSON.stringify(false))
    },
  },
  getters: {
    loggedIn(state) {
      return state.loggedIn
    },
  },
}

export default Auth
