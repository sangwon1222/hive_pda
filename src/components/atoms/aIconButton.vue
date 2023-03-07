<template>
  <button
    type="button"
    class="icon-button"
    :class="computedClasses"
    @click="$emit('icon-click')"
  >
    <a-icon :name="iconName" />
  </button>
</template>

<script>
import { computed } from 'vue'
import AIcon from './aIcon'
export default {
  name: 'aIconButton',
  components: { AIcon },
  props: {
    iconName: {
      type: String,
    },
    bgColor: {
      type: String,
      default: 'red',
      validator(value) {
        return ['blue', 'red'].includes(value)
      },
    },
  },
  setup(props) {
    const computedClasses = computed(() => {
      const color = props.bgColor

      return [color]
    })

    return { computedClasses }
  },
}
</script>

<style lang="scss" scoped>
.icon-button {
  @apply rounded-full text-white w-30 h-30 flex items-center justify-center;

  &.blue {
    @apply bg-hive-blue-200 hover:bg-hive-blue-300 active:bg-hive-blue-100;
  }

  &.red {
    @apply bg-hive-status-100 hover:bg-hive-red-300 active:bg-hive-red-100;
  }
}
</style>
