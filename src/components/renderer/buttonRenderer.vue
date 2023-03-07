<template>
  <div class="flex justify-between items-center">
    <span>{{ cellValue }}</span>
    <m-button
      @click="onClick"
      :label="label"
      type="button"
      solid
      size="small"
    />
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import MButton from '@/components/molecules/mButton'

export default {
  name: 'buttonRenderer',
  components: { MButton },
  props: {
    params: {
      type: Object,
    },
  },
  setup(props) {
    const state = reactive({
      cellValue: props.params.value,
      data: props.params.data,
      label: props.params.label,
    })

    const onClick = () => {
      props.params.context.onBtnRenderer(state.data) // mAgGrid에서 context를 설정해서 데이터를 던져주도록.
    }
    return {
      ...toRefs(state),
      onClick,
    }
  },
}
</script>

<style lang="scss" scoped></style>
