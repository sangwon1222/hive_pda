import Api from '@/http'

class Shipping {
  getPickingList = async params => await Api('/shipping/pickings', { params })
  getPickingDetailLIst = async params => {
    return await Api('/shipping/pickings/detail', { params })
  }

  getLotInfo = async params => await Api('/shipping/pickings/lot', { params })

  save = async params =>
    await Api.put('shipping/pickings/detail/save/pda', params)
}

export default new Shipping()
