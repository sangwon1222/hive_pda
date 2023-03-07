<template>
  <ag-grid-vue
    class="ag-theme-alpine ag-custom"
    :columnDefs="columnDefs"
    :rowData="rowData"
  >
  </ag-grid-vue>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'

export default {
  components: {
    AgGridVue,
  },
  props: {
    columnDefs: {
      type: Array,
    },
    rowData: {
      type: Array,
    },
  },
  setup() {
    const state = reactive({
      count: 0,
    })

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
// @import '~ag-grid-community/src/styles/ag-theme-alpine/sass/ag-theme-alpine-mixin';
.ag-custom {
  @apply w-full h-500;
  // @include ag-theme-alpine(
  //   (
  //     alpine-active-color: deeppink,
  //   )
  // );
}
</style>
