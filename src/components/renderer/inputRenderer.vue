<template>
  <div>
    <m-input :name="cellName" v-model="cellValue" rule="required" />
  </div>
</template>

<script>
import { getCurrentInstance, provide, reactive, toRefs } from 'vue'
import MInput from '@/components/molecules/mInput'
export default {
  name: 'inputRenderer',
  components: { MInput },
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
      cellValue: props.params.value !== null ? props.params.value : '',
    })

    const getValue = () => state.cellValue

    return {
      ...toRefs(state),
      getValue,
    }
  },
}
</script>

<style scoped></style>
