import Api from '@/http'

class Stock {
  getList = async params => await Api('/stock/transfer-list', { params })
  stock = async params => await Api.post('stock/transfer', params)
}

export default new Stock()
