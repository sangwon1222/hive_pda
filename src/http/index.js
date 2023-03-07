import axios from 'axios'
import { setInterceptors } from './interceptors'

const createAxios = () => {
  const createdAxios = axios.create({
    baseURL: process.env.VUE_APP_API,
    headers: {
      'Content-type': 'application/json',
    },
  })

  return setInterceptors(createdAxios)
}

const api = createAxios()

export default api
