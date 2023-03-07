<template>
  <div v-if="loadingStatus" class="loading-wrap">
    <div
      wire:loading
      class="
        fixed
        top-0
        left-0
        right-0
        bottom-0
        w-full
        h-screen
        z-50
        overflow-hidden
        bg-gray-700
        opacity-75
        flex flex-col
        items-center
        justify-center
      "
    >
      <div
        class="loader ease-linear rounded-full border-4 h-100 w-100 mb-4"
      ></div>
    </div>
  </div>
</template>

<script>
import { computed, inject, reactive, toRefs } from 'vue'
export default {
  setup() {
    const store = inject('store')
    const state = reactive({
      loadingStatus: computed(() => store.getters['loadingStatus']),
    })
    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
.loading-wrap {
  @apply w-screen h-screen fixed z-100 top-0 left-0 bg-black opacity-75;
}
.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
