<template>
  <div class="input-wrap" @click="resetInput(true)">
    <p class="label" v-if="label">{{ label }}</p>
    <a-icon :name="icon" v-if="icon" />
    <input
      :type="type"
      class="input"
      ref="refInput"
      :placeholder="placeholder"
    />
    <p v-if="format" class="label">{{ format }}</p>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import AIcon from '@/components/atoms/aIcon'

export default {
  components: {
    AIcon,
  },
  props: {
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const state = reactive({
      modelValue: props.modelValue,
      refInput: null,
    })

    const focus = () => state.refInput.focus()
    const blur = () => state.refInput.blur()
    return { focus, blur, ...toRefs(state) }
  },
}
</script>

<style lang="scss" scoped>
.input-wrap {
  @apply flex justify-between items-center pl-24 pr-24 mb-12 w-366 h-68 rounded-md bg-hive-white;
}
.input {
  @apply w-3/4 text-right;
}
.label {
  @apply text-hive-bluegray-600;
}
</style>
