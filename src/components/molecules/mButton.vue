<template>
  <button :type="type" :class="computedClasses" :disabled="disabled">
    <a-icon
      v-if="iconName"
      :name="iconName"
      class="icon"
      :disabled="disabled"
    />{{ label }}
  </button>
</template>

<script>
import { computed } from 'vue'
import AIcon from '@/components/atoms/aIcon'
export default {
  name: 'mButton',
  components: { AIcon },
  props: {
    type: {
      type: String,
      default: 'button',
      validator(value) {
        return ['button', 'submit'].includes(value)
      },
    },
    label: {
      type: String,
      default: '',
    },
    iconName: {
      type: String,
    },
    size: {
      type: String,
      default: 'normal',
      validator(value) {
        return ['normal', 'small'].includes(value)
      },
    },
    line: {
      type: Boolean,
      default: false,
    },
    solid: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const computedClasses = computed(() => {
      const size = props.size === 'small' ? 'small' : ''
      const line = props.line ? 'line' : ''
      const solid = props.solid ? 'solid' : ''
      const disabled = props.disabled ? 'disabled' : ''
      const refresh = props.iconName === 'Refresh' ? 'refresh' : ''
      const search = props.search ? 'search' : ''

      return ['button', size, line, solid, disabled, refresh, search]
    })

    return {
      computedClasses,
    }
  },
}
</script>

<style lang="scss" scoped>
.button {
  @apply flex items-center h-68 rounded-md py-12 px-30  text-hive-blue-200 hover:bg-hive-blue-400 active:text-hive-blue-100 active:bg-hive-bluegray-100;

  &.disabled {
    @apply text-hive-bluegray-500 hover:bg-transparent;
  }

  &.solid {
    @apply border-1.5 bg-hive-blue-200 text-white active:bg-hive-blue-100 hover:shadow-typing;

    &.disabled {
      @apply text-white bg-hive-bluegray-500 hover:shadow-none;
    }
  }

  &.line {
    @apply border-1.5 border-hive-blue-200 bg-white hover:shadow-typing active:border-hive-blue-100;

    &.disabled {
      @apply border-hive-bluegray-500 hover:shadow-none;
    }
  }

  &.search {
    @apply text-hive-bluegray-600 border-1.5 border-hive-bluegray-600 bg-white hover:shadow-search active:border-hive-bluegray-800 active:text-hive-bluegray-800;

    &.disabled {
      @apply border-hive-bluegray-500 text-hive-bluegray-500 hover:shadow-none;
    }
  }

  &.refresh {
    @apply font-bold text-hive-bluegray-600 hover:bg-hive-gray-700 active:bg-hive-gray-800 active:text-hive-bluegray-700;

    &.disabled {
      @apply hover:bg-white active:text-hive-bluegray-500;
    }
  }

  .icon {
    @apply inline-block mr-6;
  }

  &.small {
    @apply body-3 p-20 h-30;
  }
}
</style>
