<template>
  <div class="btn-wrap">
    <router-link class="stock-btn" to="/pda/stock/regist"
      >재고 이동</router-link
    >
  </div>
</template>

<script>
export default {
  name: 'stock_index',
}
</script>

<style lang="scss" scoped>
.btn-wrap {
  @apply flex justify-center items-center w-full h-640 bg-hive-bluegray-800 text-hive-white text-xl;
}
.stock-btn {
  @apply text-hive-bluegray-800 bg-hive-white rounded-md m-88 p-25;
}
</style>
