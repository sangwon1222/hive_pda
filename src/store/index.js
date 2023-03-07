import { createStore, createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// * 공통
import Auth from '@/store/common/auth'
import CommonApi from '@/store/common/commonApi'

// * persisted할 모듈 선별, state값으로 선별가능하다고 나와있으나 모듈만 선별됌. https://www.npmjs.com/package/vuex-persistedstate
const persistedModuleList = createPersistedState({
  paths: ['Lnb'],
})

const isProduction = process.env.NODE_ENV !== 'production'

const plugins = !isProduction
  ? [createLogger(), persistedModuleList]
  : [persistedModuleList]

export default createStore({
  state: {
    locale: 'kr',
    loadingStatus: false,
  },
  mutations: {
    setLocale(state, locale) {
      state.locale = locale
    },
    startLoading(state) {
      state.loadingStatus = true
    },
    endLoading(state) {
      state.loadingStatus = false
    },
  },
  actions: {},
  modules: {
    Auth,
    CommonApi,
  },
  getters: {
    currentLocale(state) {
      return state.locale
    },
    loadingStatus: state => state.loadingStatus,
  },
  strict: isProduction,
  plugins,
})
