<template>
  <a-radio-button
    v-for="(option, index) of options"
    :key="index"
    :label="option.label"
    :model-value="option.value"
    :radio-name="name"
    @update:model-value="changeValue"
    :checked-value="modelValue"
  />
</template>

<script>
import ARadioButton from '@/components/atoms/aRadioButton'
export default {
  name: 'mRadioButton',
  components: { ARadioButton },
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      },
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const changeValue = value => {
      emit('update:modelValue', value)
    }

    return { changeValue }
  },
}
</script>

<style lang="scss" scoped></style>
