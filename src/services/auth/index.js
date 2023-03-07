import Api from '@/http'
class Auth {
  signin = async user => {
    try {
      return await Api.post('sign-in', user)
    } catch (e) {
      localStorage.clear()
    }
  }
  signout = async () => {
    const username = JSON.parse(localStorage.getItem('username'))
    try {
      return await Api.post('logout', { username })
    } catch (e) {
      localStorage.clear()
    }
  }
}

export default new Auth()
