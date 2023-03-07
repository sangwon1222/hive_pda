<template>
  <div class="flex flex-col items-end">
    <div class="flex flex-col gap-16">
      <slot name="default" />
    </div>
    <div class="flex gap-8">
      <m-button :label="$t('field.search')" type="submit" line search />
      <m-button
        :label="$t('field.reset')"
        icon-name="Refresh"
        @click="$emit('reset-click')"
      />
    </div>
  </div>
</template>

<script>
import MButton from '@/components/molecules/mButton.vue'

export default {
  name: 'oSearchArea',
  components: { MButton },
}
</script>

<style lang="scss" scoped></style>
