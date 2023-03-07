/* eslint-disable no-unused-vars */

const CommonApi = {
  namespaced: true,
  state: () => ({
    error: null,
    commonApiLoadFlag: true,
    warehouseList: [{ warehouseId: 2, warehouseName: 'HIVE ' }],
  }),
  actions: {
    /**
     * * 페이지별로 필요한 공통api호출로직
     * 1. route meta.requiredApi 정보를 가져온다.
     * 2. requiredApi에는 해당 페이지에 필요한 api정보가 배열로 들어있음.
     * 3. 현재 state에 각 requiredApi에 상응하는 데이터가 없으면 호출함.
     */
    async getCommonApi({ state, commit }, requiredApi) {
      const data = JSON.parse(localStorage.getItem('warehouseList'))
      commit(`setWarehouseList`, data)
    },
  },
  mutations: {
    setWarehouseList(state, data) {
      state.warehouseList = data
    },
  },
  getters: {
    commonApiLoadFlag: state => state.commonApiLoadFlag,
    warehouseList: state => state.warehouseList,
  },
}

export default CommonApi
