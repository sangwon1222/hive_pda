/* eslint-disable no-unused-vars */
import jwtDecode from 'jwt-decode'
import Common from '../services/common'
import router from '../router'
import store from '../store'
import { createApp } from 'vue'
import axios from 'axios'

import Toaster from '@meforma/vue-toaster' // ! toast를 넣는방법이 이게 최선일까......
import App from '../App.vue'
const app = createApp(App)
app.use(Toaster, { position: 'top' })

/**
 * * 상황별 토큰주입
 * ! access token은 항상 - 로그인요청일때는 빼는걸로.
 * ! logout
 */
// TODO: locale도 보내야 함. 백엔드 에러처리 메시지는 다국어작업해서 response로 오기때문.
export function setInterceptors(apiClient) {
  // * 요청시 인터셉터
  apiClient.interceptors.request.use(
    config => {
      // * 요청을 보내기 전에 어떤 처리를 할 수 있다.
      store.commit('startLoading')
      if (config.url !== 'sign-in') {
        const hasToken = localStorage.getItem('token') // 현재 액세스 토큰을 가지고 있는가
        // const hasRefreshToken = localStorage.getItem('refresh') // 현재 리프레시 토큰을 가지고 있는가
        const accessToken = hasToken
          ? `Bearer ${localStorage.getItem('token')?.replace(/['"]+/g, '')}`
          : null // 토큰이 있을경우 토큰값 넣고 없으면 null
        // const refreshToken = hasRefreshToken
        //   ? `Bearer ${localStorage.getItem('refresh')?.replace(/['"]+/g, '')}`
        //   : null // 토큰이 있을경우 토큰값 넣고 없으면 null
        config.headers.Authorization = accessToken
      }
      /**
       * * 로그인
       * headers.Authorization ❌
       * headers.Refresh ❌
       * 로그인시에 위의 헤더 정보기 있어도 동작하지만 있을경우 백엔드에서 검증작업을 거쳐야 한다고 함. 그래서 빼주는 것.
       *
       */
      if (config.url === 'sign-in' || config.url === 'sign-out') {
        delete config.headers.Authorization
        delete config.headers.Refresh
      }

      /**
       * * 로그아웃
       * heasers.Authorization ⭕️
       * heasers.Refresh ⭕️
       * 로그아웃시에 위의 헤더 정보 둘 다 필요함.
       * Authorization은 기본으로 추가되어있으므로 Refresh만 추가
       */
      // if (config.url === 'logout') {
      // config.headers.Refresh = refreshToken
      // }

      return config
    },
    error => {
      // * 요청이 잘못되었을 때 에러가 컴포넌트 단으로 오기전에 어떤 처리를 할 수 있다.
      return Promise.reject(error)
    },
  )

  // * 응답시 인터셉터
  apiClient.interceptors.response.use(
    response => {
      // * 서버에 요청을 보내고 나서 응답을 반기 전에 어떤 처리를 할 수 있다.
      store.commit('endLoading')
      return response
    },
    async error => {
      // * 응답이 에러인 경우에 미리 처리 할 수 있다.
      store.commit('endLoading')
      const { config, response } = error
      const hasToken = localStorage.getItem('token') // 현재 액세스 토큰을 가지고 있는가
      const hasRefreshToken = localStorage.getItem('refresh') // 현재 리프레시 토큰을 가지고 있는가
      const accessToken = hasToken
        ? `Bearer ${hasToken?.replace(/['"]+/g, '')}`
        : null // 토큰이 있을경우 토큰값 넣고 없으면 null

      const beforeRefreshToken = hasRefreshToken
        ? `Bearer ${hasRefreshToken?.replace(/['"]+/g, '')}`
        : null // 토큰이 있을경우 토큰값 넣고 없으면 null

      const { isExpiredAccessToken, isExpiredRefreshToken } =
        Common.checkToken() // 토큰만료여부값

      if (response.status === 401) {
        // * 모든 토큰 유효기간 만료시
        if (isExpiredAccessToken && isExpiredRefreshToken) {
          await store.commit('Auth/signinFail')
          app.$toast.error('토큰이 만료되었습니다. 다시 로그인해주세요.')
          router.push({ name: 'Pdahome' })
        }
        if (isExpiredRefreshToken) {
          await store.commit('Auth/signinFail')
          app.$toast.error('토큰이 만료되었습니다. 다시 로그인해주세요.')
          router.push({ name: 'Pdahome' })
        }
        /**
         * 리프레시 토큰 만료일 경우
         */
        if (response.data.errorType === 'REFRESH_TOKEN_EXPIRED_ERROR') {
          app.$toast.error('토큰이 만료되었습니다. 다시 로그인해주세요.')
          store.commit('Auth/signout')
          router.push({ name: 'SignIn' })
        }
        if (
          // * 토큰관련 에러메시지 일치하면 토큰갱신작업
          response.data.errorType === 'TOKEN_EXPIRED_ERROR'
        ) {
          const originRequest = config // 원본요청 저장, 토큰갱신 후 다시 요청하기 위함.
          // * 리프레시 토큰 요청할떄만 headers.refresh에 refreshToken 싣어 보내기, 그 이후에는 삭제.
          // * 백엔드에서 header에 refresh가 있는지 판단하기때문.
          const instance = axios.create({
            baseURL: process.env.VUE_APP_API,
            headers: {
              Authorization: accessToken,
              Refresh: beforeRefreshToken,
            },
          })

          try {
            const { data } = await instance.post('/refresh')
            localStorage.setItem('token', JSON.stringify(data.jwtToken))
            localStorage.setItem('refresh', JSON.stringify(data.refreshToken))
            localStorage.setItem('loggedIn', config.url === 'logout')
            const userName = data.userName ? data.userName : data.username
            localStorage.setItem('username', JSON.stringify(userName))
          } catch (e) {
            localStorage.clear()
            router.push({ name: 'SignIn' })
          }

          /**
           * 이 부분에서 header값을 변경해서 다시 요청할 수도 있다.
           * 하지만 현재 로직은 요청시 로컬스토리지에서 토큰값을 가져와서 매번 넣어주고 있으므로 굳이 필요없는 작업.
           * 허나 여기서도 가능하다는 점을 기억하기 위하여 남겨 놓음.
           */
          // apiClient.default.headers.common.Authorization = `Bearer ${data.jwtToken}` // 공통헤더 Authorization 변경
          // originRequest.headers.Authorization = `Bearer ${data.jwtToken}` // 에러났던 api요청시 헤더 Authorization 변경

          return apiClient(originRequest)
        }
        /**
         * TOKEN_DELETED_ERROR, // DB에 토큰이 삭제 되었을경우 (강제 로그아웃 되었을 경우)
         * TOKEN_EXPIRED_ERROR, // 토큰이 만료되었을 경우
         * LOGIN_REQUIRED_ERROR, // 로그인이 필요할 경우
         * ACCESS_DENIED_ERROR, // 권한이 없을 경우 (해당 메뉴 접근권한을 사용자가 가지고 있지 않은 경우)
         * DUPLICATE_LOGIN_ERROR // 동시 로그인을 시도하는 경우
         * 사용자의 권한이 변경되거나, 권한내 접근가능한 메뉴가 달라졌을 경우 백엔드에서 강제로 로그아웃을 시킨다. 토큰이 탈취되었다고 판단되는 경우 관리자가 해당 사용자를 api를 사용해 강제로 로그아웃을 시킬수 있다.
         */
        if (
          response.data.errorType === 'TOKEN_DELETED_ERROR' ||
          response.data.errorType === 'LOGIN_REQUIRED_ERROR'
        ) {
          app.$toast.error(
            '인증 정보가 존재 하지 않습니다. 다시 로그인 해주세요.',
          )
          router.push({ name: 'Pdahome' })
          await store.commit('Auth/signinFail')
        }
        // * 중복로그인
        if (response.data.errorType === 'DUPLICATE_LOGIN_ERROR') {
          localStorage.clear()
          app.$toast.error('중복 로그인 되었습니다.')
          router.push({ name: 'Pdahome' })
        }
      }

      // * 권한이 없을 경우
      if (response.status === 403) {
        if (response.data.errorType === 'ACCESS_DENIED_ERROR') {
          router.push({ name: 'Pdahome' })
          app.$toast.error('권한이 없습니다.')
        }
      }
      // TODO 이메일이 없을 경우 에러 문구 출력 타입 수정 요청.
      if (response.status === 400) {
        const errorMsg = response.data.errorFieldDetail?.[0]
        app.$toast.error(errorMsg ? errorMsg : response.data?.errorMsg)
      }
      if (response.status === 500) {
        app.$toast.error(response.data.errorMsg)
      }
      return Promise.reject(error)
    },
  )

  return apiClient
}
