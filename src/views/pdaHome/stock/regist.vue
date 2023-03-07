<template>
  <div class="stock-wrap">
    <a-pda-header
      :initKeyboardFlag="isKeyboardVisible"
      @toggleKeyboard="toggleKeyboard"
      :activeBtn="canSave"
      @save="stock"
      buttonLabel="저장"
      title="재고 이동"
    />

    <div class="regist-wrap">
      <div class="w-full my-10">
        <button
          class="list-btn"
          @click="resetInput('gridAndInputReset')"
          v-if="isRefreshData"
        />
      </div>

      <p class="item-name" v-text="itemName" />
      <div class="input-wrap" @click="refFromLoc?.select()">
        <p class="text-hive-bluegray-600">From Loc</p>
        <input
          :inputmode="keyboardMode"
          placeholder="로케이션 바코드 스캔/ 입력"
          ref="refFromLoc"
          class="input"
          type="text"
          @input="fromLocNum = fromLocNum.toUpperCase().trim()"
          @keyup.enter.prevent="enterFromLoc"
          v-model="fromLocNum"
        />
      </div>
      <div class="input-wrap" @click="refItemBarcode?.select()">
        <a-icon name="BarcodeIcon" />
        <input
          :inputmode="keyboardMode"
          placeholder="상품 바코드,코드스캔/입력"
          ref="refItemBarcode"
          class="input"
          type="text"
          @input="checkBarcode"
          v-model="itemBarcode"
          @keyup.enter.prevent="enterItemBarcode"
        />
      </div>

      <div class="data-list" v-if="expirationDate !== '' || lotNo !== ''">
        <ul class="flex items-center">
          <li class="data-label">유통기한</li>
          <li class="data-value">{{ expirationDate }}</li>
        </ul>
        <ul class="flex items-center">
          <li class="data-label">Lot No</li>
          <li class="data-value">{{ lotNo }}</li>
        </ul>
      </div>

      <div :class="showInput">
        <div class="input-wrap mt-10" @click="refToLoc?.select()">
          <p class="text-hive-bluegray-600">To Loc</p>
          <input
            :inputmode="keyboardMode"
            placeholder="로케이션 바코드 스캔/ 입력"
            ref="refToLoc"
            class="input"
            type="text"
            @keyup.enter.prevent="enterToLoc"
            @input="checkToLoc"
            v-model="toLocNum"
          />
        </div>
        <div class="input-wrap">
          <p class="text-hive-bluegray-600">이동 수량</p>
          <input
            ref="refTransfer"
            placeholder="0 "
            class="input"
            type="number"
            v-model="transferQtyText"
            @input="checkTransfer"
            @keyup.enter.prevent="transferQty ? stock() : null"
          />
          <p class="f-r text-hive-gray-400">EA</p>
        </div>
        <p class="w-full text-right text-hive-teal-500">
          / {{ reactRemainQty }} EA
        </p>
      </div>

      <p v-text="`전체 ${totalCount} 개`" class="w-full p-10 text-xs" />
      <ag-grid-vue
        :default-col-def="{ suppressMenu: true, sortable: true }"
        :overlay-loading-template="overlay('loading')"
        :overlay-no-rows-template="overlay('no-row')"
        class="ag-theme-alpine w-full h-400"
        row-model-type="infinite"
        row-selection="single"
        suppress-drag-leave-hides-columns
        @cell-clicked="onCellClicked"
        :get-row-style="getRowStyle"
        :context="{ onTotalCount }"
        @grid-ready="onGridReady"
        :column-defs="columnDefs"
        :cache-block-size="100"
        :cache-overflow-size="100"
      />
    </div>
  </div>
  <a-modal ref="refModal">
    <div class="modal">
      <div v-html="popupText" />
      <div class="modal-btn-wrap">
        <m-button label="닫기" @click="refModal.close()" solid />
      </div>
    </div>
  </a-modal>
</template>

<script>
import { computed, inject, onMounted, reactive, toRefs, ref } from 'vue'
import APdaHeader from '@/components/atoms/aPdaHeader.vue'
import MButton from '@/components/molecules/mButton.vue'
import ColumnDefs from '@/static/agGrid/columnDefs'
import AModal from '@/components/atoms/aModal.vue'
import AIcon from '@/components/atoms/aIcon.vue'
import CommonApi from '@/services/common'
import { useHead } from '@vueuse/head'
import { find, isEmpty, debounce } from 'lodash'
import Api from '@/services/stock'
import {
  useValidOnlyNumberWithEng,
  useSetInfinifyGridData,
  useReadyToSearch,
  getRowStyle,
  overlay,
} from '@/composables'

export default {
  name: 'stock_index',
  components: {
    AIcon,
    AModal,
    MButton,
    APdaHeader,
  },
  setup() {
    const refItemBarcode = ref(null)
    const refTransfer = ref(null)
    const refFromLoc = ref(null)
    const refModal = ref(null)
    const refToLoc = ref(null)

    const toast = inject('toast')
    const store = inject('store')
    const state = reactive({
      title: '재고이동',
      showInput: 'hide-input',
      transferQty: computed(() => {
        const transferQty = +state.transferQtyText
        const isError = typeof transferQty !== 'number' || transferQty < 0
        return isError ? 0 : transferQty
      }),
      // 항목을 선택하면 유저에게 보여줄 데이터
      warehouseList: computed(() => store.getters['CommonApi/warehouseList']),
      reactRemainQty: computed(() => state.remainQty - state.transferQty),
      canSave: computed(() => state.selectedData && state.transferQty > 0),
      isRefreshData: computed(() => Object.keys(state.searchParams).length > 1),
      columnDefs: ColumnDefs.pdaStockData,
      transferQtyText: '',
      expirationDate: '',
      itemBarcode: '',
      fromLocNum: '',
      popupText: '',
      toLocNum: '',
      itemName: '',
      lotNo: '',
      warehouseId: 0,
      totalCount: 0,
      remainQty: 0,
      fromLocId: 0,
      locId: {},
      searchParams: {},
      selectedData: {},
      //keyboard
      isKeyboardVisible: false,
      keyboardMode: computed(() => {
        const mode = state.isKeyboardVisible ? 'text' : 'none'
        return mode
      }),
    })
    useHead({
      title: computed(() => state.title),
    })

    const toggleKeyboard = flag => {
      state.isKeyboardVisible = flag
    }

    onMounted(() => {
      state.warehouseId = state.warehouseList[0].warehouseId
    })

    const onGridReady = async ({ api, columnApi }) => {
      state.gridApi = api
      state.columnApi = columnApi
      state.searchParams = { warehouseId: state.warehouseId }
      await useSetInfinifyGridData(state, Api.getList)
      refFromLoc.value.focus()
    }
    const onTotalCount = async total => {
      state.totalCount = total
      if (!total) {
        toast.error('다시 검색해주세요.')
        return resetInput('gridAndInputReset')
      }

      const { warehouseId, location, itemSearchText } = state.searchParams
      const required = warehouseId && location && itemSearchText
      const node = state.gridApi.getRowNode('0')
      resetInput()

      if (required && node) {
        node.setSelected(true)
        await setData(node)
      }
    }

    const resetInput = async mode => {
      switch (mode) {
        case 'gridAndInputReset':
          if (state.isRefreshData) {
            state.searchParams = { warehouseId: state.warehouseId }
            await useSetInfinifyGridData(state, Api.getList)
          }
          state.fromLocNum = ''
          refFromLoc.value.focus()
          break
      }
      state.showInput = 'hide-input'
      state.selectedData = {}
      state.expirationDate = ''
      state.itemBarcode = ''
      state.itemName = ''
      state.lotNo = ''
      state.toLocNum = ''
      state.transferQtyText = ''
      state.remainQty = 0
    }

    const enterFromLoc = () => {
      if (state.fromLocNum) {
        refItemBarcode.value.select()
      } else {
        refFromLoc.value.focus()
      }
    }
    const enterItemBarcode = async () => {
      if (state.itemBarcode) {
        await searchData()
      } else {
        refItemBarcode.value.focus()
      }
    }
    const enterToLoc = () => {
      if (state.toLocNum) {
        refTransfer.value.focus()
      } else {
        refToLoc.value.focus()
      }
    }

    const searchData = async () => {
      state.searchParams = useReadyToSearch({
        warehouseId: state.warehouseId,
        location: state.fromLocNum,
        itemSearchText: state.itemBarcode,
      })
      await useSetInfinifyGridData(state, Api.getList)
    }

    const onCellClicked = async node => {
      if (!node.data.remainingQty) {
        resetInput()
        toast.error('이미 완료된 항목입니다.')
        return
      }
      await setData(node)
      await searchData()
    }

    const setData = async ({ data }) => {
      state.expirationDate = data.expirationDate
      state.fromLocNum = data.fromLocation
      state.itemBarcode = data.itemBarcode
      state.remainQty = data.remainingQty
      state.itemName = data.itemName
      state.selectedData = data
      state.lotNo = data.lotNo
      state.showInput = 'show-input'
      state.transferQtyText = ''
      state.toLocNum = ''
      refToLoc.value.focus()
    }

    const checkBarcode = async ({ data }) => {
      state.itemBarcode = state.itemBarcode.toUpperCase().trim()
      const errorList = [
        {
          info: '바코드는 숫자와 영문만 입력할 수 있다.',
          isError: !useValidOnlyNumberWithEng(data),
          text: '(숫자)와 (영문)으로 작성해주세요.',
        },
        {
          info: 'fromLoc 을 입력해야만 바코드를 입력할 수 있다.',
          isError: state.fromLocNum === '',
          text: '(From Loc)을 먼저 입력해주세요.',
        },
      ]
      const error = find(errorList, { isError: true })
      if (error) {
        state.itemBarcode = ''
        toast.error(error.text)
      }
    }

    const checkToLoc = () => {
      state.toLocNum = state.toLocNum.toUpperCase().trim()
      const notScan = state.itemBarcode === '' && state.fromLocNum === ''
      if (notScan) {
        state.toLocNum = ''
        toast.error('상품을 먼저 스캔하거나 입력하세요.')
      }
    }

    const checkTransfer = () => {
      // *** reactRemainQty = 남은 재고 수량 - 입력한 이동 수량
      const errorList = [
        {
          info: 'toLoc을 입력해야 이동수량을 입력할 수 있다.',
          isError: state.toLocNum === '',
          text: '(To Loc)을 먼저 스캔하거나 입력하세요.',
        },
        {
          info: '이동수량이 재고수량을 초과할 수 없다.',
          isError: state.reactRemainQty < 0,
          text: '재고를 (초과하였습니다.)  이동 수량을 다시 입력해주세요.',
        },
      ]
      const error = find(errorList, { isError: true })
      if (!isEmpty(error)) {
        toast.error(error.text)
        state.transferQtyText = ''
        return
      }
    }

    const getLocId = async () => {
      try {
        const { data } = await CommonApi.getRackSectionList({
          warehouseId: state.warehouseId,
          searchText: state.toLocNum,
        })

        const result = data.length === 1 ? data[0] : {}
        return result
      } catch (e) {
        return {}
      }
    }

    const validate = async () => {
      let errMsg = ''
      const hasNotLocId = !state.locId.id
      const { fromLocationId } = state.selectedData
      const notChanged = fromLocationId === state.locId.id

      if (notChanged) errMsg = '적치된 로케이션과 이동할 로케이션이 똑같습니다.'
      if (hasNotLocId) errMsg = '조회된 이동 로케이션이 없습니다.'

      if (notChanged || hasNotLocId) {
        toast.error(errMsg)
        state.transferQtyText = ''
        state.toLocNum = ''
        refToLoc.value.focus()
        return false
      }
      return true
    }

    const stock = debounce(
      async () => {
        refTransfer.value.blur()

        const { expirationDate, fromLocationId, itemId, lotNo, warehouseId } =
          state.selectedData
        state.locId = await getLocId()
        const isActive = await validate()
        if (!isActive) return
        try {
          await Api.stock([
            {
              transferQty: state.transferQty,
              toLocationId: state.locId.id,
              expirationDate,
              fromLocationId,
              warehouseId,
              itemId,
              lotNo,
            },
          ])
          toast.success('재고이동 성공')
        } catch (e) {
          console.error(e)
        } finally {
          refModal.value.close()
          resetInput('gridAndInputReset')
        }
      },
      1000,
      { leading: true, trailing: false },
    )

    return {
      ...toRefs(state),
      checkTransfer,
      onCellClicked,
      checkBarcode,
      onTotalCount,
      onGridReady,
      getRowStyle,
      checkToLoc,
      resetInput,
      enterFromLoc,
      overlay,
      stock,
      enterToLoc,
      toggleKeyboard,
      enterItemBarcode,
      refItemBarcode,
      refTransfer,
      refFromLoc,
      refModal,
      refToLoc,
    }
  },
}
</script>

<style lang="scss" scoped>
.stock-wrap {
  @apply flex flex-col items-center tracking-tighter bg-hive-gray-600 w-full;
}
.regist-wrap {
  @apply flex flex-col items-center px-10 pb-16 w-full h-full;
}
.input-wrap {
  @apply flex justify-between items-center p-10  mt-10 w-full  rounded-md bg-hive-white;
}
.input {
  @apply w-3/4 text-right;
}
.modal {
  @apply bg-hive-white flex flex-col justify-between w-294 h-220 px-32 py-32 rounded-lg text-xl tracking-tighter font-bold;
}
.modal-btn-wrap {
  @apply w-full flex justify-around;
}

.list-btn {
  @apply overflow-hidden relative  cursor-pointer w-60 h-50;
  border: 2px rgba(0, 0, 0, 0.4) solid;
  border-radius: 10px;
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 4px rgba(0, 0, 0, 0.6) solid;
  }
  &:before {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    border-bottom-color: transparent;
  }
  &:after {
    border-top-color: transparent;
    border-right-color: transparent;
    margin-top: 6px;
    margin-left: 12px;
    width: 20px;
    height: 20px;
  }
}

.item-name {
  @apply mb-10 w-full text-left text-hive-bluegray-700 text-sm;
}
.data-list {
  @apply flex flex-col justify-between w-full h-40 tracking-tighter-sm;
}
.data-label {
  @apply w-60 text-hive-bluegray-600  text-xs;
}
.data-value {
  @apply text-hive-bluegray-700   text-xsm font-bold;
}
.show-input {
  @apply h-full w-full;
}
.hide-input {
  @apply overflow-hidden h-0 w-full;
}
</style>
