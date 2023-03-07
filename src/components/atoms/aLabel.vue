<template>
  <label v-if="defaultLabel" :for="props.for" class="label">
    {{ defaultLabel }}
    <span v-if="required" class="requirement">*</span>
  </label>
</template>

<script>
import { computed, inject } from 'vue'

export default {
  name: 'aLabel',
  props: {
    for: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const $t = inject('t')
    const defaultLabel = computed(() => {
      return !props.text ? $t('field.defaultLabel') : props.text
    })

    return {
      props,
      defaultLabel,
    }
  },
}
</script>

<style lang="scss" scoped>
.label {
  @apply body-3 flex gap-4;
}
.requirement {
  @apply text-base text-hive-status-100 h-6;
}
</style>
