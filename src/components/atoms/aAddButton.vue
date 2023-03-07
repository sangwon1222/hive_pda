<template>
  <button :class="computedClasses" type="button" @click="$emit('add-click')">
    <div class="label">{{ label }}</div>
    <a-icon name="Add-item" />
  </button>
</template>

<script>
import aIcon from './aIcon.vue'
import { computed } from 'vue'

export default {
  components: {
    aIcon,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      // 상품추가 외에, "로케이션 추가", "담당자 추가"가 추가될수도 있다고 합니다.
      type: String,
      default: '상품 추가',
    },
  },
  setup(props) {
    const computedClasses = computed(() => {
      const disabled = props.disabled ? 'disabled' : ''
      return ['button', disabled]
    })

    return {
      computedClasses,
    }
  },
}
</script>

<style lang="scss" scoped>
.button {
  @apply flex items-center justify-center bg-hive-bluegray-300 h-45 w-full rounded-smd cursor-pointer gap-12 text-hive-navy-200;
}
.label {
  @apply h6 text-hive-navy-200;
}
</style>
