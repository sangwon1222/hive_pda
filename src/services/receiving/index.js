import Api from '@/http'

class Receiving {
  getStorings = async params => {
    return await Api('receiving/storings', { params })
  }

  setStorings = async params => {
    await Api.put('receiving/storings', params)
  }
}

export default new Receiving()
