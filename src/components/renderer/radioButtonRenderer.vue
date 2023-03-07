<template>
  <div class="flex justify-between items-center">
    <button type="button" @click="onClickRadio">
      <a-icon
        class="icon"
        v-if="rowIndex === selectedRowIndex"
        name="RadioOn"
      ></a-icon>
      <a-icon class="icon" v-else name="RadioOff"></a-icon>
    </button>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import AIcon from '@/components/atoms/aIcon'

export default {
  name: 'radioButtonRenderer',
  components: { AIcon },
  props: {
    params: {
      type: Object,
    },
  },
  setup(props) {
    const store = useStore()
    const state = reactive({
      rowIndex: props.params.rowIndex,
    })

    const selectedRowIndex = computed(() => {
      return store.getters[props.params.selectedRowIndexPath]
    })

    const onClickRadio = () => {
      props.params.context.onClickRadio(props.params)
    }

    return {
      ...toRefs(state),
      onClickRadio,
      selectedRowIndex,
    }
  },
}
</script>

<style lang="scss" scoped></style>
