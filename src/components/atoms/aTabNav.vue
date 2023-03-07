<template>
  <ul class="tab-nav-wrap">
    <li
      class="tab-nav-item"
      :class="{ active: currentIndex === index }"
      v-for="(nav, index) of navItems"
      :key="index"
      @click="clickNav(index)"
    >
      {{ nav }}
    </li>
  </ul>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  props: {
    navItems: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      currentIndex: 0,
    })

    const clickNav = index => {
      emit('select', index)
      const buttons = document.getElementsByClassName('tab-nav-item')
      for (const button of Object.entries(buttons)) {
        button[1].classList.remove('active')
      }
      state.currentIndex = index
    }

    return {
      ...toRefs(state),
      clickNav,
    }
  },
}
</script>

<style lang="scss" scoped>
.tab-nav-wrap {
  @apply flex items-center gap-24 border-b-1 border-hive-bluegray-400;
}
.tab-nav-item {
  @apply py-12 block text-hive-bluegray-600 body-1 relative cursor-default;
  &.active {
    @apply h5 text-hive-teal-500;
    &:after {
      content: '';
      @apply absolute block w-full h-1 border-b-2 border-hive-teal-500
          -bottom-1;
    }
  }
}
</style>
