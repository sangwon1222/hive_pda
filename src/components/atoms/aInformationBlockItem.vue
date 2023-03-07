<template>
  <div class="flex">
    <div class="label">{{ data.label }}</div>
    <div class="info">
      <div class="value">{{ data.value }}</div>
      <div v-if="data.detail" class="detail">{{ data.detail }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'aInformationBlockItem',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss" scoped>
.label {
  @apply h6 text-hive-teal-500 pr-16;
}

.info {
  @apply max-w-xs pr-60;

  .value {
    @apply body-1;
  }

  .detail {
    @apply body-2 text-hive-bluegray-500 mt-8;
  }

  &:last-child {
    @apply pr-0;
  }
}
</style>
