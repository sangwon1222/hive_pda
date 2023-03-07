<template>
  <div class="receive-wrap">
    <a-pda-header
      :initKeyboardFlag="isKeyboardVisible"
      @toggleKeyboard="toggleKeyboard"
      :activeBtn="canSave"
      @save="save"
      buttonLabel="적치"
      title="입고 적치"
    />
    <!-- activeKeyBoard -->
    <div class="regist-wrap">
      <p class="item-name" v-text="itemName" />
      <div class="input-wrap" @click="resetInput(true)">
        <a-icon name="BarcodeIcon"></a-icon>
        <input
          type="text"
          ref="refBarcode"
          v-model="itemBarcode"
          @input="checkBarcode"
          @keyup.enter.prevent="searchBarcode"
          :inputmode="keyboardMode"
          placeholder="상품 바코드,코드스캔/입력"
        />
      </div>

      <div class="input-wrap" @click="resetInput()">
        <p class="text-hive-bluegray-600">To Loc</p>
        <input
          type="text"
          ref="refToLocCode"
          v-model="toLocCode"
          @input="checkToLoc"
          @keyup.enter.prevent="enterToLoc"
          :inputmode="keyboardMode"
          placeholder="로케이션 바코드 스캔/ 입력"
        />
      </div>

      <div class="input-wrap" @click="orderedQtyText = ''">
        <p class="text-hive-bluegray-600">적치 수량</p>
        <input
          type="number"
          ref="refOrderedQty"
          v-model="orderedQtyText"
          @input="checkOrderedQty"
          placeholder="0 "
          @keyup.enter.prevent="save"
        />
        <p class="text-hive-gray-400" v-text="'EA'" />
      </div>

      <div class="flex justify-between items-center w-full py-10">
        <p v-text="`전체 ${totalCount} 개`" class="inline-block text-xs" />
        <p
          class="inline-block text-right text-hive-teal-500"
          v-text="`/ ${reactRemainQty} EA`"
        />
      </div>

      <ag-grid-vue
        :default-col-def="{ suppressMenu: true }"
        suppress-drag-leave-hides-columns
        @cell-clicked="onCellClicked"
        :context="{ onTotalCount }"
        :get-row-style="getRowStyle"
        @grid-ready="onGridReady"
        :column-defs="columnDefs"
        :cache-block-size="100"
        :cache-overflow-size="100"
        :overlay-loading-template="overlay('loading')"
        :overlay-no-rows-template="overlay('no-row')"
        class="ag-theme-alpine w-full h-400"
        row-selection="single"
        :rowData="rowData"
      />
    </div>
  </div>

  <a-modal ref="refModal">
    <div class="modal">
      <div v-html="popupText" />
      <div class="modal-btn-wrap">
        <m-button
          label="닫기"
          @click="closePopup"
          :line="canSave"
          :solid="!canSave"
        />
        <m-button label="적치" @click="save" v-if="canSave" solid />
      </div>
    </div>
  </a-modal>
</template>

<script>
import { reactive, toRefs, inject, computed, onMounted, ref } from 'vue'
import columnDefs from '@/static/agGrid/columnDefs'
import AIcon from '@/components/atoms/aIcon.vue'
import AModal from '@/components/atoms/aModal.vue'
import APdaHeader from '@/components/atoms/aPdaHeader.vue'
import MButton from '@/components/molecules/mButton.vue'
import Api from '@/services/receiving'
import commonApi from '@/services/common'
import { useValidOnlyNumberWithEng, getRowStyle, overlay } from '@/composables'
import { isEmpty, find } from 'lodash'

export default {
  name: 'receiving_index',
  components: {
    AIcon,
    AModal,
    APdaHeader,
    MButton,
  },
  setup() {
    const toast = inject('toast')
    const store = inject('store')
    const refOrderedQty = ref(null)
    const refToLocCode = ref(null)
    const refBarcode = ref(null)
    const state = reactive({
      warehouseList: computed(() => store.getters['CommonApi/warehouseList']),
      orderedQty: computed(() => {
        const orderQty = +state.orderedQtyText
        const isError = typeof orderQty !== 'number' || orderQty < 0
        return isError ? 0 : orderQty
      }),
      reactRemainQty: computed(() => state.remainQty - state.orderedQty),
      canSave: computed(() => {
        const isActiveSelectedData = !isEmpty(state.selectedData)
        const isActiveOrderQty = state.orderedQty > 0
        return isActiveSelectedData && isActiveOrderQty
      }),
      // ref
      refModal: null,
      // 인풋 값
      orderedQtyText: '',
      itemBarcode: '',
      toLocCode: '',
      remainQty: 0,

      //popup
      popupText: '',
      //ag grid vue
      rowData: [],
      rackSecionData: { id: 0, code: '' },
      columnDefs: columnDefs.pdaReceiveData,
      selectedData: [],
      warehouseId: 0,
      totalCount: '',
      itemName: '',
      //keyboard
      isKeyboardVisible: false,
      keyboardMode: computed(() => {
        const mode = state.isKeyboardVisible ? 'text' : 'none'
        return mode
      }),
    })
    onMounted(() => (state.warehouseId = state.warehouseList[0].warehouseId))

    const setData = async () => {
      const { data } = await Api.getStorings({ warehouseId: state.warehouseId })
      state.rowData = data.content
      await onTotalCount(data.totalCount)
    }

    const onTotalCount = async total => (state.totalCount = total)

    const onGridReady = async ({ api, columnApi }) => {
      state.gridApi = api
      state.columnApi = columnApi
      await setData()

      inputFocus()
    }
    const toggleKeyboard = flag => (state.isKeyboardVisible = flag)

    // 바코드 input
    const checkBarcode = async ({ data }) => {
      state.itemBarcode = state.itemBarcode.toUpperCase().trim()
      if (!useValidOnlyNumberWithEng(data)) {
        toast.error('숫자와 영문으로 작성해주세요.')
        state.itemBarcode = ''
      }
    }

    const searchBarcode = async () => {
      if (!state.itemBarcode) return
      let nodeId = -1
      state.gridApi.forEachNode(node => {
        if (node.data.itemBarcode === state.itemBarcode) nodeId = node.id
      })

      if (nodeId > -1) {
        const searched = state.gridApi.getRowNode(nodeId)
        searched.setSelected(true)
        onCellClicked({ node: searched })
        refToLocCode.value?.focus()
      } else {
        refBarcode.value.select()
        toast.error('검색된 바코드가 없습니다.')
      }
    }

    // ToLoc input
    const checkToLoc = async () => {
      state.toLocCode = state.toLocCode.toUpperCase().trim()
    }

    // 적치수량 input
    const checkOrderedQty = async ({ data }) => {
      state.orderedQtyText = parseInt(`${state.orderedQtyText}`, 10)
      if (data && !state.orderedQtyText) state.orderedQtyText = data

      //*** reactRemainQty = 재고수량 - 입력한 입고수량
      const errorList = [
        {
          name: '입고할 항목을 선택해야한다.',
          isError: isEmpty(state.selectedData),
          text: '적치할 (상품)을 먼저 스캔하거나 입력하세요.',
        },
        {
          name: 'to location을 입력해야 적치수량을 입력할 수 있다.',
          isError: state.toLocCode === '',
          text: '적치할 (TO LOC)을 먼저 스캔하거나 입력하세요.',
        },
        {
          name: '적치수량이 미적치수량을 초과할 수 없다.',
          isError: state.reactRemainQty < 0,
          text: '미적치 수량을 (초과하였습니다.) 적치수량을 다시 입력해주세요.',
        },
        {
          name: '수량은 숫자만 기입해야 한다.',
          isError: data === '+' || data === '-',
          text: '(숫자)를 기입해주세요.',
        },
      ]
      const error = find(errorList, { isError: true })
      if (!isEmpty(error)) errorOrderQty(error.text)
    }

    const errorOrderQty = text => {
      toast.error(text)
      refOrderedQty.value.blur()
      state.orderedQtyText = ''
      isEmpty(state.selectedData)
        ? (state.remainQty = 0)
        : (state.remainQty = state.selectedData.remainingQty)
    }

    const onCellClicked = ({ node }) => {
      node.setSelected(node.data.remainingQty >= 1)
      state.itemBarcode = node.data.itemBarcode
      state.remainQty = node.data.remainingQty
      state.itemName = node.data.itemName
      state.selectedData = node.data
      state.orderedQtyText = ''

      inputFocus()
    }

    const resetInput = async all => {
      if (all) {
        state.selectedData = {}
        state.itemBarcode = ''
        state.itemName = ''
        await setData()
      }
      state.toLocCode = ''
      state.orderedQtyText = ''
      isEmpty(state.selectedData)
        ? (state.remainQty = 0)
        : (state.remainQty = state.selectedData.remainingQty)
    }

    const enterToLoc = () => {
      if (state.toLocCode) {
        refOrderedQty.value.focus()
      } else {
        refToLocCode.value.focus()
      }
    }
    // 비어있는 인풋에 포커스
    const inputFocus = () => {
      const inputs = [state.itemBarcode, state.toLocCode, state.orderedQtyText]
      const refs = [refBarcode, refToLocCode, refOrderedQty]
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === '') {
          refs[i].value.focus()
          break
        }
      }
    }

    // 팝업닫고 비어있는 인풋 포커스
    const closePopup = () => {
      state.refModal.close()
      inputFocus()
    }

    // TODO 입고적치할때 로케이션아이디 필요 => api 로케이션id말고 로케이션code를 받는 방식으로 (출고는 code로 받음)
    const getRackSections = async () => {
      try {
        await commonApi
          .getRackSectionList({
            warehouseId: state.selectedData.warehouseId,
            searchText: state.toLocCode,
          })
          .then(({ data }) => {
            data.length === 1
              ? (state.rackSecionData = data[0])
              : (state.rackSecionData = { id: 0, code: '' })
          })
      } catch (e) {
        state.rackSecionData = { id: 0, code: '' }
      }
    }

    // 입고적치
    const save = async () => {
      state.refModal.close()
      if (!state.canSave) return
      refOrderedQty.value.blur()

      if (isEmpty(state.selectedData)) {
        toast.error('스캔된 상품이 없습니다.')
        return
      }

      await getRackSections()
      if (state.rackSecionData.id === 0) {
        toast.error('조회된 로케이션이 없습니다.')
        resetInput(true)
        refBarcode.value.focus()
        return
      }

      const saveParam = [
        {
          storingLinesId: state.selectedData.id,
          storingRackSectionList: [
            {
              code: state.rackSecionData.code,
              rackSectionId: state.rackSecionData.id,
              stockedQty: state.orderedQty,
            },
          ],
        },
      ]
      try {
        await Api.setStorings(saveParam)
      } catch (e) {
        console.error(e)
        toast.error('저장 실패')
      } finally {
        resetInput(true)
        state.refModal.close()
        state.orderedQtyText = ''
        refBarcode.value.focus()
      }
    }

    return {
      ...toRefs(state),
      toggleKeyboard,
      checkOrderedQty,
      onCellClicked,
      searchBarcode,
      checkBarcode,
      onTotalCount,
      onGridReady,
      getRowStyle,
      resetInput,
      checkToLoc,
      closePopup,
      inputFocus,
      enterToLoc,
      overlay,
      save,
      refBarcode,
      refOrderedQty,
      refToLocCode,
    }
  },
}
</script>

<style lang="scss" scoped>
.receive-wrap {
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
.modal {
  @apply bg-hive-white flex flex-col justify-between w-320 h-220 px-32 py-32 rounded-lg text-xl tracking-tighter font-bold;
}
.modal-btn-wrap {
  @apply w-full flex justify-around;
}

.item-name {
  @apply mb-12 w-full text-left text-hive-bluegray-700 text-sm;
}
</style>
