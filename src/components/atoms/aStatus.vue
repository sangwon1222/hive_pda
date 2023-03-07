<template>
  <span :class="computedClasses">{{ label }}</span>
</template>

<script>
import { computed, inject } from 'vue'

export default {
  name: 'aStatus',
  props: {
    status: {
      type: Object,
    },
  },
  setup(props) {
    const $t = inject('t')

    const computedClasses = computed(() => {
      return ['status', `status-${statusCode[props.status.code].colorCode}`]
    })

    const label = computed(() => {
      return statusCode[props.status.code].label
    })

    const statusCode = {
      400101: { colorCode: 100, label: $t('status.400101') },
      400102: { colorCode: 200, label: $t('status.400102') },
      400103: { colorCode: 300, label: $t('status.400103') },
      400104: { colorCode: 400, label: $t('status.400104') },
      400105: { colorCode: 500, label: $t('status.400105') },
      400106: { colorCode: 600, label: $t('status.400106') },
      400107: { colorCode: 700, label: $t('status.400107') },
      400108: { colorCode: 800, label: $t('status.400108') },
      900101: { colorCode: 100, label: $t('status.900101') },
      900102: { colorCode: 700, label: $t('status.900102') },
      900103: { colorCode: 700, label: $t('status.900103') },
      900104: { colorCode: 200, label: $t('status.900104') },
    }

    return {
      computedClasses,
      statusCode,
      label,
    }
  },
}
</script>

<style lang="scss" scoped>
.status {
  @apply inline-block rounded-xl border border-hive-bluegray-700 text-hive-bluegray-700 body-4 px-10 py-8 bg-hive-bluegray-100;

  &-100 {
    @apply border-hive-status-100 bg-hive-status-bg-100 text-hive-status-100;
  }
  &-200 {
    @apply border-hive-status-200 bg-hive-status-bg-200 text-hive-status-200;
  }
  &-300 {
    @apply border-hive-status-300 bg-hive-status-bg-300 text-hive-status-300;
  }
  &-400 {
    @apply border-hive-status-400 bg-hive-status-bg-400 text-hive-status-400;
  }
  &-500 {
    @apply border-hive-status-500 bg-hive-status-bg-500 text-hive-status-500;
  }
  &-600 {
    @apply border-hive-status-600 bg-hive-status-bg-600 text-hive-status-600;
  }
  &-700 {
    @apply border-hive-status-700 bg-hive-status-bg-700 text-hive-status-700;
  }
}
</style>
