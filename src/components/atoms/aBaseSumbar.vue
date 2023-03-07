<template>
  <div class="sumbar">
    <h4>
      {{ $t('field.sum') }} <small>{{ $t('field.vatIncluded') }}</small>
    </h4>
    <ul>
      <slot name="list" />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'aBaseSumbar',
}
</script>

<style lang="scss" scoped>
.sumbar {
  @apply flex items-center rounded-lg bg-hive-bluegray-800 text-white justify-between px-80 py-20;
  small {
    @apply body-4 text-hive-bluegray-600 ml-12;
  }
  ul {
    @apply flex items-center;
    ::v-slotted(li) {
      @apply flex items-center;
      &:first-child {
        @apply h4;
      }
      .title {
        @apply body-2 text-hive-bluegray-400 mr-12 min-w-40;
      }
      .value {
        @apply h5;
      }
    }
  }
}
</style>
