<template>
  <div class="flex flex-col items-center tracking-tighter bg-hive-gray-600">
    <div class="header">출고피킹</div>
    <div class="regist-wrap">
      <div class="input-wrap">
        <a-icon name="BarcodeIcon" />
        <input
          ref="refLotsCode"
          v-model="locCode"
          @keyup.enter.prevent="goDetailPage"
          @input="locCode = locCode.toUpperCase()"
          @click="resetInput"
          :inputmode="isKeyboardVisible"
          placeholder="출고지시번호 스캔/ 입력"
        />
      </div>
      <p v-text="`전체 ${totalCount} 개`" class="w-full py-10 text-xs" />

      <ag-grid-vue
        :default-col-def="{ suppressMenu: true, sortable: false }"
        :overlay-loading-template="overlay('loading')"
        :overlay-no-rows-template="overlay('no-row')"
        class="ag-theme-alpine w-full p-0 h-400"
        row-model-type="infinite"
        suppress-drag-leave-hides-columns
        :get-row-style="getRowStyle"
        :column-defs="columnDefs"
        @grid-ready="onGridReady"
        :cache-block-size="100"
        :cache-overflow-size="100"
        :context="{ onTotalCount }"
      />
    </div>
  </div>
</template>

<script>
import { computed, inject, reactive, toRefs } from 'vue'
import ColumnDefs from '@/static/agGrid/columnDefs'
import AIcon from '@/components/atoms/aIcon.vue'
import { useHead } from '@vueuse/head'
import Api from '@/services/shipping'
import { find } from 'lodash-es'
import { useSetInfinifyGridData, getRowStyle, overlay } from '@/composables'

export default {
  components: {
    AIcon,
  },
  setup() {
    const toast = inject('toast')
    const router = inject('router')
    const store = inject('store')
    const state = reactive({
      warehouseList: computed(() => store.getters['CommonApi/warehouseList']),
      warehouseId: computed(() => state.warehouseList[0].id),
      title: '출고피킹',
      columnDefs: ColumnDefs.pdaShippingPickingData,
      searchParams: { sortBy: 'pickingStatusCode-asc' },
      refModal: null,
      isKeyboardVisible: 'none',
      lotInfo: {
        id: 0,
        pickStatusCode: 0,
        shipmentPaymentTypeId: 0,
      },
      refLotsCode: null,
      locCode: '',
      selectedLotCode: '',
      shipmentPaymentTypeId: 0,
      popupText: '',
      totalCount: 0,
      gridApi: null,
      columnApi: null,
      testText: '',
      test: true,
      scanCount: 0,
    })

    useHead({
      title: computed(() => state.title),
    })

    const onGridReady = async ({ api, columnApi }) => {
      state.gridApi = api
      state.columnApi = columnApi
      await useSetInfinifyGridData(state, Api.getPickingList)
      state.refLotsCode.focus()
    }
    const onTotalCount = total => (state.totalCount = total)

    const resetInput = async () => {
      state.lotInfo = {
        id: 0,
        pickStatusCode: 0,
        shipmentPaymentTypeId: 0,
      }
      state.ref
      state.refLotsCode.select()
    }

    /**
     * 출고지시번호 검색
     */
    const searchLotId = async () => {
      state.lotInfo.id = 0
      try {
        const { data } = await Api.getLotInfo({ lotCode: state.locCode })
        const { lotId, pickStatusCode, shipmentPaymentTypeId } = data
        if (lotId && pickStatusCode && shipmentPaymentTypeId) {
          state.lotInfo.id = lotId
          state.lotInfo.pickStatusCode = pickStatusCode
          state.lotInfo.shipmentPaymentTypeId = shipmentPaymentTypeId
        } else {
          state.lotInfo = {
            id: 0,
            pickStatusCode: 0,
            shipmentPaymentTypeId: 0,
          }
          state.locCode = ''
        }
      } catch (e) {
        resetInput()
        state.lotInfo = {
          id: 0,
          pickStatusCode: 0,
          shipmentPaymentTypeId: 0,
        }
        state.locCode = ''
      }
    }

    /**
     * 출고지시번호 상세화면으로 전환
     */
    const goDetailPage = async () => {
      state.locCode = state.locCode.trim()
      if (!state.locCode || state.locCode.length < 12) {
        state.refLotsCode.select()
        return
      }
      await searchLotId()

      const { id, pickStatusCode, shipmentPaymentTypeId } = state.lotInfo
      const errorList = [
        { text: '출고완료된 항목입니다.', error: pickStatusCode === 310704 },
        {
          text: '보충지시가 필요한 항목입니다. <br/>보충지시완료후 피킹해주세요.',
          error: pickStatusCode === 310703,
        },
        {
          text: '출고지시번호 결과값이 없습니다.',
          error: !(id && shipmentPaymentTypeId),
        },
      ]
      const error = find(errorList, el => el.error)

      if (error) {
        toast.error(error.text)
        state.lotInfo.id = 0
        state.refLotsCode.select()
      } else {
        router.push({
          name: 'PdaShippingRegist',
          params: { id, code: state.locCode, shipmentPaymentTypeId },
        })
      }
    }

    return {
      ...toRefs(state),
      resetInput,
      onTotalCount,
      goDetailPage,
      onGridReady,
      getRowStyle,
      overlay,
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  @apply flex justify-start items-center p-10 w-full  text-hive-bluegray-800 tracking-tighter font-bold text-xl;
}
.regist-wrap {
  @apply flex flex-col items-center px-10 pb-16 w-full h-full;
}
.input-wrap {
  @apply flex justify-between items-center p-10  w-full  rounded-md bg-hive-white;
  > input {
    @apply w-3/4 text-right;
  }
}
</style>
