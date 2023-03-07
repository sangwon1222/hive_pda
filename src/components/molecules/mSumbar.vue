<template>
  <a-base-sumbar>
    <template #list>
      <li v-for="(item, index) in data" :key="index">
        <a-icon name="SeperatorDark" class="mx-32" v-if="index" />
        <div>
          <span class="title">{{ item[labelKey] }} </span>
          <span class="value">{{ item[valueKey].toLocaleString() }}</span>
        </div>
      </li>
    </template>
  </a-base-sumbar>
</template>

<script>
import ABaseSumbar from '@/components/atoms/aBaseSumbar.vue'
import AIcon from '@/components/atoms/aIcon.vue'

export default {
  name: 'mSumbar',
  components: {
    ABaseSumbar,
    AIcon,
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    labelKey: {
      type: String,
    },
    valueKey: {
      type: String,
    },
  },
}
</script>
