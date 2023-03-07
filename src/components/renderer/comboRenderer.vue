<template>
  <m-combo
    :id="id"
    v-model="cellValue"
    :name="cellName"
    :search-api="params.searchApi"
    :search-param-key="params.searchParamKey"
    :option-label-key="params.optionLabelKey"
    :option-value-key="params.optionValueKey"
    @select-item="selectItem"
  />
</template>

<script>
import { getCurrentInstance, provide, reactive, toRefs } from 'vue'
import MCombo from '@/components/molecules/mCombo'

export default {
  name: 'comboRenderer',
  components: {
    MCombo,
  },
  props: {
    params: {
      type: Object,
    },
  },
  setup(props) {
    const app = getCurrentInstance().appContext.config.globalProperties
    provide('t', app.$t)
    provide('toast', app.$toast)

    const state = reactive({
      cellName: `${props.params.column.colId}-${props.params.rowIndex}`, // 변경 필요.
      id: `${props.params.column.colId}-${props.params.rowIndex}`, // 변경 필요.
      cellValue: {
        [props.params.optionLabelKey]: '',
        [props.params.optionValueKey]: '',
      },
    })

    const getValue = () => state.cellValue[props.params.optionLabelKey]

    const selectItem = () => {
      props.params.context.getObject(state.cellValue)
      props.params.api.stopEditing()
    }

    return {
      ...toRefs(state),
      getValue,
      selectItem,
    }
  },
}
</script>

<style lang="scss" scoped></style>
