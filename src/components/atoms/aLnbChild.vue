<template>
  <ul class="child-wrap">
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
  name: 'aLnbChild',
  props: {
    childList: {
      type: Array,
    },
    name: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore()
    const router = inject('router')
    const toast = inject('toast')
    const state = reactive({
      tabList: computed(() => store.getters['GlobalTab/getTabList']),
    })

    const addTab = child => {
      if (state.tabList.length > 10) {
        toast.error('탭은 최대 10개까지 가능합니다.')
        return
      }
      store.commit('GlobalTab/addTab', child)
      store.commit('Lnb/setLnb', { lnbName: props.name, route: child.route })
      router.push({ path: child.route })
    }

    return {
      ...toRefs(state),
      addTab,
    }
  },
}
</script>

<style lang="scss" scoped>
$lnb-width: theme('spacing.200');
$lnb-width-pl: theme('spacing.28');
$lnb-width-pr: theme('spacing.34');

.child-wrap {
  @apply break-words;
}
.child {
  @apply cursor-pointer body-3 px-34 py-12 rounded-md text-hive-bluegray-500 hover:text-hive-bluegray-500 hover:bg-hive-bluegray-700 first:mt-16;
  &.active {
    @apply text-hive-teal-400;
  }
}
</style>
