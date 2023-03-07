<template>
  <span :class="computedClasses">{{ parseInt(data).toLocaleString() }}</span>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'aChip',
  props: {
    data: {
      type: [String, Number],
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const computedClasses = computed(() => {
      const disabled = props.disabled ? 'disabled' : ''
      return ['chip', disabled]
    })

    return {
      computedClasses,
    }
  },
}
</script>

<style lang="scss" scoped>
.chip {
  @apply inline-block bg-hive-bluegray-900 rounded-2xl text-white body-4 py-4 px-8;

  &.disabled {
    @apply bg-hive-bluegray-700;
  }
}
</style>
