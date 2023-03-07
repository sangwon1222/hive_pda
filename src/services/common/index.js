import jwtDecode from 'jwt-decode'
import Api from '@/http'

class Common {
  /**
   * ! access token 만료검사
   * 만료되었거나 1분이하일 때 refresh요청
   * case 1 - access token 만료 refresh token 만료 -> 다시 로그인하세요.
   * case 2 - access token 만료 refresh token 유효 -> access token 재발급
   * case 3 - access token 유효 refresh token 만료 -> refresh token 재발급
   * case 4 - access token 유효 refresh toekn 유효 -> 다음 미들웨어
   */
  checkToken = () => {
    const hasToken = localStorage.getItem('token')
    const isExpiredAccessToken = hasToken
      ? Date.now() > jwtDecode(localStorage.getItem('token')).exp * 1000
      : null
    const isExpiredRefreshToken = hasToken
      ? Date.now() > jwtDecode(localStorage.getItem('refresh')).exp * 1000
      : null
    return {
      isExpiredAccessToken,
      isExpiredRefreshToken,
    }
  }
  // * 랙섹션존코드 리스트
  getRackSectionZoneList = async params => {
    try {
      return await Api('common/rack-section-zone', {
        params,
      })
    } catch (e) {
      return []
    }
  }
  // * 랙섹션코드 리스트
  getRackSectionList = async params => {
    try {
      return await Api('common/rack-sections', {
        params,
      })
    } catch (e) {
      return []
    }
  }
  /**
   * * 검색상품 리스트
   * @param shipperId
   * @param searchText*
   * @param warehouseId
   */
  getSearchItemsList = async params => {
    try {
      return await Api('common/search-items', {
        params,
      })
    } catch (e) {
      return []
    }
  }
  // * 배송방식 리스트
  getShipmentTypeList = async () => {
    try {
      return await Api('common/shipment-type')
    } catch (e) {
      return []
    }
  }
  // * 화주 담당자 리스트
  getShipperContactList = async shipperId => {
    try {
      return await Api('common/shipper/contacts', { params: { id: shipperId } })
    } catch (e) {
      return []
    }
  }
  // * 화주 리스트
  getShipperList = async searchText => {
    try {
      return await Api('common/shippers', { params: { searchText } })
    } catch (e) {
      return []
    }
  }
  // * 공급사 담당자 리스트, but 공급사id 필수임..
  getSupplierContactList = async supplierId => {
    try {
      const params = { id: supplierId }
      return await Api('common/supplier/contacts', { params })
    } catch (e) {
      return []
    }
  }
  // * 공급사 리스트
  getSupplierList = async searchText => {
    try {
      return await Api('common/suppliers', { params: { searchText } })
    } catch (e) {
      return []
    }
  }
  // * 창고리스트 전체
  getWarehouseList = async () => {
    try {
      return await Api('common/warehouses')
    } catch (e) {
      return []
    }
  }
  getSearchItem = async () => {
    try {
      return await Api.get('common/search-items')
    } catch (e) {
      return []
    }
  }
}

export default new Common()
