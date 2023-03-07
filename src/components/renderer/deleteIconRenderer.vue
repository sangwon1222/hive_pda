<template>
  <button v-if="isActive" @click="onClick" type="button">
    <a-icon name="delete" />
  </button>
</template>

<script>
import { reactive, toRefs } from 'vue'
import AIcon from '@/components/atoms/aIcon'

export default {
  name: 'deleteIconRenderer',
  components: { AIcon },
  props: {
    params: {
      type: Object,
    },
  },
  setup(props) {
    const state = reactive({
      data: props.params,
      isActive: props.params.isActive,
    })

    const onClick = () => {
      props.params.context.onDeleteRenderer(state.data) // mAgGrid에서 context를 설정해서 데이터를 던져주도록.
    }
    return {
      ...toRefs(state),
      onClick,
    }
  },
}
</script>

<style scoped></style>
