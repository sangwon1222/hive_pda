<template>
  <!-- modal을 어디에 위치 시킬것인가 -->
  <teleport to="body">
    <div class="backdrop" v-if="isVisible">
      <div class="modal-container" v-click-outside="outsideClick">
        <!-- slot을 기본모달 확장 -->
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script>
import { reactive, toRefs } from 'vue'
import vClickOutside from 'click-outside-vue3'

export default {
  name: 'aModal',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  setup() {
    const state = reactive({
      isVisible: false,
    })

    // 부모 컴포넌트에서 접근하기 위한 함수.
    const open = () => {
      state.isVisible = true
    }
    const close = () => {
      state.isVisible = false
    }

    const outsideClick = () => {
      state.isVisible = false
    }

    // return해줘야 부모함수에서 접근 가능
    return {
      ...toRefs(state),
      open,
      close,
      outsideClick,
    }
  },
}
</script>

<style lang="scss" scoped>
.backdrop {
  @apply flex fixed items-center justify-center bg-black bg-opacity-80 z-10 w-screen h-screen left-0 top-0;
}
</style>
