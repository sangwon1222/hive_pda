<template>
  <div class="btn-wrap">
    <router-link class="shipping-btn" to="/pda/shipping">출고 피킹</router-link>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  setup() {
    const state = reactive({
      //
    })

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
.btn-wrap {
  @apply flex justify-center items-center w-full h-788 bg-hive-bluegray-800 text-hive-white text-xl;
}
.shipping-btn {
  @apply text-hive-bluegray-800 bg-hive-white rounded-md m-88 p-25;
}
</style>
