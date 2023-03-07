<template>
  <div>
    <div class="shipping-wrap">
      <a-pda-header
        :title="`출고 번호 #${$route.params.code}`"
        buttonLabel="저장"
        :activeBtn="saveActiveBtn"
        :activeKeyBoard="+$route.params.shipmentPaymentTypeId === 1"
        :initKeyboardFlag="isKeyboardMode"
        @toggleKeyboard="toggleKeyboard"
        @save="save"
        type="button"
      />

      <div class="regist-wrap">
        <div
          class="input-wrap"
          @click="
            () => {
              refLocNo.blur()
              refLocNo.select()
            }
          "
        >
          <p class="text-hive-bluegray-600">Loc No</p>
          <input
            @keyup.enter.prevent="enterLocNoInput"
            :inputmode="keyboardMode"
            :placeholder="locPlaceholder"
            @input="checkLocNo"
            v-model="locNo"
            ref="refLocNo"
            type="text"
          />
        </div>

        <div
          class="input-wrap"
          @click="
            () => {
              refItemBarcode.blur()
              refItemBarcode.select()
            }
          "
        >
          <a-icon name="BarcodeIcon" />
          <input
            :placeholder="itemBarcodePlaceholder"
            :inputmode="keyboardMode"
            @keyup.enter.prevent="scanBarcode"
            @input="checkBarcode"
            v-model="itemBarcode"
            ref="refItemBarcode"
            type="text"
          />
        </div>

        <div class="input-wrap" @click="pickingQtyText = ''">
          <p class="text-hive-bluegray-600">피킹 수량</p>
          <input
            ref="refPickingQty"
            type="number"
            v-model="pickingQtyText"
            @input="checkPickingQty"
            placeholder="0 "
          />
          <p class="f-r text-hive-gray-400">EA</p>
        </div>

        <div class="total-count-div">
          <p v-text="`전체 ${rowData.length} 개`" class="total-count-p-tag" />
          <p class="pickingQty-p-tag" v-text="`/ ${reactRemainQty} EA`" />
        </div>

        <ag-grid-vue
          :default-col-def="{ suppressMenu: true, sortable: true }"
          :overlay-loading-template="overlay('loading')"
          :overlay-no-rows-template="overlay('no-row')"
          class="ag-theme-alpine w-full h-400"
          :column-defs="columnDefs"
          suppress-drag-leave-hides-columns
          suppress-row-click-selection
          :get-row-style="getRowStyle"
          @grid-ready="onGridReady"
          :row-data="rowData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useValidOnlyNumberWithEng, getRowStyle, overlay } from '@/composables'
import { computed, inject, reactive, toRefs, ref } from 'vue'
import APdaHeader from '@/components/atoms/aPdaHeader'
import { filter, find, isEmpty, isNull, debounce } from 'lodash'
import columnDefs from '@/static/agGrid/columnDefs'
import AIcon from '@/components/atoms/aIcon'
import { useHead } from '@vueuse/head'
import Api from '@/services/shipping'
import { useRoute } from 'vue-router'

export default {
  name: 'shipping_detail',
  components: {
    AIcon,
    APdaHeader,
  },

  setup() {
    // ref
    const refItemBarcode = ref(null)
    const refPickingQty = ref(null)
    const refLocNo = ref(null)

    const route = useRoute()
    const router = inject('router')
    const toast = inject('toast')
    const state = reactive({
      title: '출고피킹 상세',
      pickingQty: computed(() => {
        const isNaNQty = isNaN(+state.pickingQtyText)
        const qty = isNaNQty ? 0 : +state.pickingQtyText
        return qty
      }),
      reactRemainQty: computed(() => state.remainQty - state.pickingQty),
      required: computed(
        () =>
          state.locNo != '' &&
          state.itemBarcode != '' &&
          state.pickingQtyText != '' &&
          !isEmpty(state.searchedData),
      ),
      columnDefs: columnDefs.pdaPickingDetailData,
      // 인풋 값
      itemBarcodePlaceholder: '',
      pickingQtyText: '',
      locPlaceholder: '',
      itemBarcode: '',
      remainQty: 0,
      locNo: '',
      lotId: 0,
      rowData: [],
      searchedData: {},
      //keyboard
      saveActiveBtn: computed(
        () => shipmentPaymentTypeId === 1 && state.pickingQty > 0,
      ),
      isKeyboardMode: shipmentPaymentTypeId === 1,
      keyboardMode: computed(() => {
        const mode = state.isKeyboardMode ? 'text' : 'none'
        return mode
      }),
    })
    const shippingLotsId = route.params.id
    const shipmentPaymentTypeId = +route.params.shipmentPaymentTypeId ?? 0
    useHead({ title: computed(() => state.title) })

    const toggleKeyboard = debounce(
      () => (state.isKeyboardMode = !state.isKeyboardMode),
      500,
      { leading: true, trailing: false },
    )

    const onGridReady = async ({ api, columnApi }) => {
      if (isNaN(shipmentPaymentTypeId)) {
        toast.error('항목의 정보가 없습니다.')
        router.push({ name: 'PdaShipping' })
        return
      }
      state.columnApi = columnApi
      state.gridApi = api
      await setGridData()
    }

    const setGridData = async () => {
      try {
        const { data } = await Api.getPickingDetailLIst({ shippingLotsId })
        const notComplete = filter(data, el => el.statusCode !== 3100404)
        const isComplete = filter(data, el => el.statusCode === 3100404)
        state.rowData = [...notComplete, ...isComplete]
        refLocNo.value.blur()
        refLocNo.value.focus()
        setPlaceholder()
      } catch (e) {
        toast.clear()
        toast.error('출고지시서를 다시 스캔해주세요.')
        router.push({ name: 'PdaShipping' })
      }
    }

    /**
     * 피킹 완료되지 않은 항목 중, 첫번째 항목을 placeholder에 넣어준다
     * placeholder에 값을 넣어줘 사용자가 스캔할 로케이션위치로 향하게끔 해준다.
     * * 물류센터 프로세스 =>
     *     물품 스캔 따로 다하고, 물품 따로 담으러 가면 안됨.
     *       ex) 스캔,스캔,스캔 => 담고,담고,담고 X
     *       ex) (스캔, 물품담고), (다음 물품 스캔, 담고), (다음 물품 스캔, 담고) O
     */
    const setPlaceholder = () => {
      const firstRow = find(state.rowData, el => el.statusCode != 3100404)
      const isComplete = isEmpty(firstRow)

      if (isComplete) router.push({ name: 'PdaShipping' })

      if (!isComplete) {
        state.itemBarcodePlaceholder = firstRow.itemBarcode
        state.locPlaceholder = firstRow.locationCode
      }
    }

    const resetInput = async all => {
      if (all) state.locNo = ''
      state.pickingQtyText = ''
      state.itemBarcode = ''
      state.searchedData = {}
      state.remainQty = 0
      setSelected({ isSelected: false })
    }

    const enterLocNoInput = () => {
      if (state.locNo) {
        refItemBarcode.value.blur()
        refItemBarcode.value?.focus()
      } else {
        refLocNo.value.blur()
        refLocNo.value.focus()
      }
    }
    const checkLocNo = async () => {
      state.locNo = state.locNo.toUpperCase().trim()
      if (state.locNo === '') resetInput(true)
    }

    // 바코드 인풋에 키보드로 입력할때
    const checkBarcode = ({ data }) => {
      state.itemBarcode = state.itemBarcode.toUpperCase().trim()
      isNull(data) ? null : barcodeValid(data)
    }

    const barcodeValid = data => {
      const errorList = [
        {
          text: '숫자와 영문으로 작성해주세요.',
          isError: !useValidOnlyNumberWithEng(data),
          input: refItemBarcode.value,
        },
        {
          text: '로케이션을 먼저 스캔/입력해주세요.',
          isError: state.locNo === '',
          input: refLocNo.value,
        },
      ]
      const error = find(errorList, { isError: true })
      if (error) {
        refPickingQty.value.blur()
        toast.clear()
        toast.error(error.text)
        state.itemBarcode = ''
        error.input.blur()
        error.input.focus()
      }
    }

    /**
     *  * 스캔된바코드   ===   스캔한바코드    ? 피킹수량+1,
     *    scannedBarcode === state.itemBarcode ? 피킹수량+1,
     */
    const scanBarcode = async () => {
      refItemBarcode.value.blur()
      const emptyScanData = isEmpty(state.searchedData)
      const findData = find(
        state.rowData,
        ({ locationCode, itemBarcode }) =>
          locationCode === state.locNo && itemBarcode === state.itemBarcode,
      )
      const hasNotRow = emptyScanData && !findData
      if (hasNotRow) return resetScanCondition()

      const rowIndex = state.rowData.indexOf(findData)
      if (emptyScanData) setSelected({ isSelected: true, rowIndex })
      else await plusQty()
    }

    /**
     ** 바코드 중복스캔=> 피킹 수량 + 1,
     *    (이전 스캔한 상품의 바코드)와 (현재 스캔한 상품의 바코드)가 일치한지 확인
     */
    const plusQty = async () => {
      const prevBarcode = state.searchedData.itemBarcode

      const canPlusQty = state.itemBarcode === prevBarcode && state.required
      if (canPlusQty) state.pickingQtyText = `${state.pickingQty + 1}`
      else return resetScanCondition()

      const canSave = canPlusQty && state.reactRemainQty === 0
      const canNotSave = canPlusQty && state.reactRemainQty > 0
      if (canSave) save()
      if (canNotSave) {
        refItemBarcode.value.blur()
        refItemBarcode.value.select()
      }
    }

    const resetScanCondition = () => {
      toast.clear()
      toast.error('바코드를 다시 스캔해주세요.')
      if (!isEmpty(state.searchedData)) setSelected({ isSelected: false })
      resetInput()
      refItemBarcode.value.blur()
      refItemBarcode.value.focus()
    }

    const setSelected = ({ isSelected, rowIndex }) => {
      if (isSelected) {
        const getSearchedNode = state.gridApi.getRowNode(`${rowIndex}`)
        getNodeStatus({ node: getSearchedNode, isSelected })
      } else {
        state.searchedData = {}
        state.gridApi.forEachNode(node => node.setSelected(false))
      }
    }

    const getNodeStatus = async ({ node, isSelected }) => {
      const { data } = node
      const { statusCode, orderedQty, pickedQty, itemBarcode, locationCode } =
        data
      const status = statusCode === 3100404 ? '피킹완료' : '피킹미완료'

      if (status === '피킹완료') {
        state.searchedData = {}
        toast.clear()
        toast.success('이미 피킹완료된 항목입니다.')
        state.locNo = ''
        resetScanCondition()
        resetInput(true)
      }
      if (status === '피킹미완료') {
        state.searchedData = data
        state.pickingQtyText = '1'
        state.remainQty = orderedQty - pickedQty
        state.itemBarcode = itemBarcode
        state.locNo = locationCode
        if (state.reactRemainQty) {
          refItemBarcode.value.blur()
          refItemBarcode.value.select()
        } else save()
        await node.setSelected(isSelected)
      }
    }

    // 수량 체크 (로케이션, 바코드 값을 입력후, 입력가능)
    const checkPickingQty = async () => {
      const errorList = [
        {
          name: 'LocNo, Barcode가 입력된 상태(상품 스캔)한 이후, 스캔된 정보(LocNo, Barcode)에 따른 한 항목이 지정되었을 때만 피킹수량을 입력할 수 있다.',
          isError:
            !state.locNo || !state.itemBarcode || isEmpty(state.searchedData),
          text: '(상품)을 먼저 스캔하거나 입력하세요.',
        },
        {
          name: '피킹수량이 지시수량을 초과할 수 없다.',
          isError: state.reactRemainQty < 0,
          text: '지시수량을 (초과하였습니다.)  피킹수량을 다시 입력해주세요.',
        },
      ]
      const error = find(errorList, { isError: true })
      if (!isEmpty(error)) {
        toast.clear()
        state.pickingQtyText = '0'
        toast.error(error.text)
      }
    }

    // 최종 적치 요청
    const save = debounce(
      async () => {
        refItemBarcode.value.blur()
        try {
          const { itemBarcode, locationCode, pickedQty } = state.searchedData
          const pickingQty = state.pickingQty + pickedQty
          const lotCode = route.params.code
          await Api.save({ itemBarcode, locationCode, lotCode, pickingQty })
        } catch (e) {
          toast.error('저장 실패')
          console.error(e)
        } finally {
          resetInput(true)
          await setGridData()
          refLocNo.value.blur()
          refLocNo.value.focus()
        }
      },
      500,
      { leading: true, trailing: false },
    )

    return {
      ...toRefs(state),
      checkPickingQty,
      checkBarcode,
      scanBarcode,
      enterLocNoInput,
      toggleKeyboard,
      getRowStyle,
      onGridReady,
      resetInput,
      checkLocNo,
      overlay,
      save,
      refItemBarcode,
      refPickingQty,
      refLocNo,
    }
  },
}
</script>

<style lang="scss" scoped>
.shipping-wrap {
  @apply flex flex-col items-center tracking-tighter bg-hive-gray-600 w-full;
}
.regist-wrap {
  @apply flex flex-col items-center px-10 pb-16 w-full h-full;
}
.input-wrap {
  @apply flex justify-between items-center p-10  mt-10 w-full  rounded-md bg-hive-white;
  > input {
    @apply w-3/4 text-right;
  }
}
.total-count-div {
  @apply flex justify-between items-center w-full py-10;
}
.total-count-p-tag {
  @apply inline-block text-xs;
}
.pickingQty-p-tag {
  @apply inline-block text-right text-hive-teal-500;
}
.modal {
  @apply bg-hive-white flex flex-col justify-between w-294 h-220 px-32 py-32 rounded-lg text-xl tracking-tighter font-bold;
}
.modal-btn-wrap {
  @apply w-full flex justify-around;
}
.keyboard-icon {
  @apply relative;
}
</style>
