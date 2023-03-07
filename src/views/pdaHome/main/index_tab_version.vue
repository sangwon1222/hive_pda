<template>
  <div>
    <div class="header-btn-wrap">
      <button
        type="button"
        :class="currentTap === 'Receiving' ? computedClasses : ''"
        class="tab-btn"
        @click="goPage('Receiving')"
      >
        입고</button
      ><br />
      <button
        type="button"
        :class="currentTap === 'Shipping' ? computedClasses : ''"
        class="tab-btn"
        @click="goPage('Shipping')"
      >
        출고</button
      ><br />
      <button
        type="button"
        :class="currentTap === 'Stock' ? computedClasses : ''"
        class="tab-btn"
        @click="goPage('Stock')"
      >
        재고
      </button>
    </div>
    <component :is="currentTap" />
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import Receiving from '@/views/pdaHome/receiving/index.vue'
import Shipping from '@/views/pdaHome/shipping/index.vue'
import Stock from '@/views/pdaHome/stock/index.vue'
import { useHead } from '@vueuse/head'

export default {
  components: {
    Receiving,
    Shipping,
    Stock,
  },
  setup() {
    //const store = inject('store')
    const state = reactive({
      title: 'PDA-메인페이지',
      currentTap: 'Receiving',

      computedClasses: 'text-hive-lime-200',
      // 나중에 물류센터 리스트를 받아와서 선택하는 화면이 기획된다.
      // warehouseList: computed(() => store.getters['CommonApi/warehouseList']),
    })
    useHead({
      title: computed(() => state.title),
    })

    const goPage = tabName => {
      state.currentTap = tabName
    }

    return {
      ...toRefs(state),
      goPage,
    }
  },
}
</script>

<style lang="scss" scoped>
.header-btn-wrap {
  @apply w-full flex justify-center bg-hive-bluegray-700 text-hive-white text-xl;
}
.tab-btn {
  @apply max-w-138 w-1/3 h-56;
  &:active {
    @apply text-hive-lime-200;
  }
}
</style>
