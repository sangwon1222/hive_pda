<template>
  <div class="flex justify-between items-center">
    <m-input :name="cellName" v-model="cellValue" rule="required" />
    <button v-if="isActive" @click="onClick" type="button" class="mx-15">
      <a-icon name="AddBlue" />
    </button>
  </div>
</template>

<script>
import { getCurrentInstance, provide, reactive, toRefs } from 'vue'
import AIcon from '@/components/atoms/aIcon'
import MInput from '@/components/molecules/mInput'
export default {
  name: 'inputWithAddRenderer',
  components: { MInput, AIcon },
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
      cellValue: props.params.value,
      cellName: `${props.params.column.colId}-${props.params.rowIndex}`,
      data: props.params.data,
      isActive: props.params.isActive,
    })

    const onClick = () => {
      props.params.context.onAddBtnRenderer(props.params) // mAgGrid에서 context를 설정해서 데이터를 던져주도록.
    }

    const getValue = () => state.cellValue

    return {
      ...toRefs(state),
      onClick,
      getValue,
    }
  },
}
</script>

<style lang="scss" scoped></style>
