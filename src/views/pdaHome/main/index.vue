<template>
  <div>
    <div class="list-bg">
      <button
        class="list-btn"
        :class="i === 0 ? 'mt-10' : ''"
        v-for="(v, i) in list"
        @click="goPage(v.page)"
        :key="i"
        v-text="v.label"
      />
    </div>
  </div>
</template>

<script>
import { computed, inject, reactive, toRefs } from 'vue'
import { useHead } from '@vueuse/head'

export default {
  name: 'main_index',
  components: {
    // Receiving,
    // Shipping,
    // Stock,
  },
  setup() {
    const router = inject('router')
    const state = reactive({
      title: 'PDA-메인페이지',
      list: [
        { label: '입고적치', page: 'PdaReceiving' },
        { label: '피킹', page: 'PdaShipping' },
        { label: '재고', page: 'PdaStockRegist' },
      ],
    })
    useHead({
      title: computed(() => state.title),
    })

    const goPage = page => {
      router.push({ name: page })
    }

    return {
      ...toRefs(state),
      goPage,
    }
  },
}
</script>

<style lang="scss" scoped>
.list-bg {
  @apply flex flex-col justify-start items-start p-10 w-full h-600 bg-hive-bluegray-800 text-hive-white text-xl;
}
.list-btn {
  @apply p-20 mb-20 w-full text-hive-bluegray-800 bg-hive-white rounded-md;
}
</style>
