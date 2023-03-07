<template>
  <label :class="computedClasses">
    <a-icon
      class="icon"
      v-if="checkedValue === modelValue"
      name="RadioOn"
    ></a-icon>
    <a-icon class="icon" v-else name="RadioOff"></a-icon>
    <span v-if="label">{{ label }}</span>
    <input
      type="radio"
      :name="radioName"
      :checked="modelValue"
      @change="$emit('update:modelValue', modelValue)"
    />
  </label>
</template>

<script>
import { computed } from 'vue'
import AIcon from './aIcon'
export default {
  name: 'aRadioButton',
  components: { AIcon },
  props: {
    checkedValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    radioName: {
      type: String,
      required: true,
    },
    modelValue: {
      required: true,
    },
  },
  setup(props) {
    const computedClasses = computed(() => {
      const inactive =
        props.checkedValue !== props.modelValue ? 'text-hive-bluegray-500' : ''
      return ['label', inactive]
    })

    return { computedClasses }
  },
}
</script>

<style lang="scss" scoped>
.label {
  @apply inline-flex items-center body-2 cursor-pointer mr-16;
  // TODO: 마진값을 상위에서 조절할 수 있도록 변경
}

.icon {
  @apply inline mr-8;
}

input[type='radio'] {
  @apply hidden;
}
</style>
