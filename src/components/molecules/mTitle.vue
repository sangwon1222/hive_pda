<template>
  <div>
    <div v-if="subTitleData" class="subTitle">
      {{ subTitle }} : {{ subTitleData }}
    </div>
    <div>
      <span class="title">{{ title }}</span>
      <span v-if="count" class="detail ml-8">
        {{ $t('field.total') }} {{ parseInt(count).toLocaleString()
        }}{{ $t('field.ea') }}
      </span>
      <a-status v-if="status" class="status" :status="status" />
    </div>
    <div v-if="description" class="detail mt-8">{{ description }}</div>
    <div v-if="slotActive" class="pt-16">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import aStatus from '@/components/atoms/aStatus.vue'

export default {
  components: { aStatus },
  name: 'mTitle',
  props: {
    subTitle: {
      type: String,
    },
    subTitleData: {
      type: String,
    },
    title: {
      type: String,
    },
    count: {
      type: [String, Number],
    },
    status: {
      type: Object,
    },
    description: {
      type: String,
    },
  },
  setup(_, { slots }) {
    const slotActive = computed(() => {
      return slots.default
    })

    return { slotActive }
  },
}
</script>

<style lang="scss" scoped>
.subTitle {
  @apply h4 text-hive-teal-500 mb-8;
}
.title {
  @apply h3 text-hive-bluegray-900;
}
.status {
  @apply inline-block ml-12 align-top;
}
.detail {
  @apply body-2 text-hive-bluegray-600;
}
</style>
