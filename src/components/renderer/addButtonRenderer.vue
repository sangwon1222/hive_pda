<template>
  <div class="flex justify-between items-center">
    {{ cellValue }}
    <button v-if="isActive" @click="onClick" type="button">
      <a-icon name="AddBlue" />
    </button>
  </div>
</template>

<script>
import AIcon from '@/components/atoms/aIcon'
import { reactive, toRefs } from 'vue'
export default {
  name: 'inputWithAddRenderer',
  components: { AIcon },
  props: {
    params: {
      type: Object,
    },
  },
  setup(props) {
    const state = reactive({
      cellValue: props.params.value,
      cellName: `${props.params.column.colId}-${props.params.rowIndex}`,
      data: props.params.data,
      isActive: props.params.isActive,
    })

    const onClick = () => {
      props.params.context.onAddBtnRenderer(props.params) // mAgGrid에서 context를 설정해서 데이터를 던져주도록.
    }
    return {
      ...toRefs(state),
      onClick,
    }
  },
}
</script>

<style scoped></style>
