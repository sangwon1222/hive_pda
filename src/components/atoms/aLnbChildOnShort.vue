<template>
  <ul class="lnb-child-on-short-wrap">
    <li class="first-child">
      {{ $t(`field.${name}`) }}
    </li>
    <li
      v-for="(child, index) of childList"
      :key="index"
      class="child"
      :class="{ active: child.isActive }"
      @click.stop="addTab(child)"
    >
      {{ $t(`field.${child.label}`) }}
    </li>
  </ul>
</template>

<script>
import { inject, computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    childList: {
      type: Array,
    },
    name: {
      type: String,
    },
  },
  setup(props) {
    const router = inject('router')
    const store = useStore()
    const toast = inject('toast')
    const state = reactive({
      tabList: computed(() => store.getters['GlobalTab/getTabList']),
    })

    const goPage = child => {
      router.push({ path: child.route })
      store.commit('Lnb/setLnb', { lnbName: props.name, route: child.route })
    }
    const addTab = child => {
      if (state.tabList.length > 10) {
        toast.error('탭은 최대 10개까지 가능합니다.')
        return
      }
      store.commit('GlobalTab/addTab', child)
      goPage(child)
    }

    return {
      ...toRefs(state),
      goPage,
      addTab,
    }
  },
}
</script>

<style lang="scss" scoped>
$lnb-short-left: theme('spacing.51');

.lnb-child-on-short-wrap {
  @apply bg-hive-bluegray-900 top-0 absolute z-5 w-160 rounded-r-lg p-12 break-words;
  left: $lnb-short-left;
  li {
    @apply px-16 py-12 body-3 text-hive-bluegray-500 cursor-pointer;
    &:not(.first-child) {
      @apply hover:bg-hive-bluegray-700 rounded-md;
    }
    &.active {
      @apply text-hive-teal-400;
    }
    &.first-child {
      @apply pb-15 pt-10 px-0 text-hive-teal-400 h6;
    }
  }
}
</style>
