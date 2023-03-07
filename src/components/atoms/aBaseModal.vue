<template>
  <!-- modal을 어디에 위치 시킬것인가 -->
  <teleport to="body">
    <div :class="backdrop" v-if="isVisible">
      <div class="modal-container" v-click-outside="outsideClick">
        <!-- slot을 기본모달 확장 -->
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script>
import { computed, ref } from 'vue'
import vClickOutside from 'click-outside-vue3'

export default {
  name: 'aBaseModal',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    direction: {
      type: String,
      default: 'center',
    },
  },
  setup(props) {
    const isVisible = ref(false)
    const backdrop = computed(() => {
      const containerCenter =
        props.direction === 'center'
          ? 'items-center justify-center'
          : 'justify-start'
      return ['backdrop', containerCenter]
    })

    // 부모 컴포넌트에서 접근하기 위한 함수.
    const open = () => {
      isVisible.value = true
    }
    const close = () => {
      isVisible.value = false
    }

    const outsideClick = () => {
      isVisible.value = false
    }

    // return해줘야 부모함수에서 접근 가능
    return {
      isVisible,
      open,
      close,
      outsideClick,
      backdrop,
    }
  },
}
</script>

<style lang="scss" scoped>
.backdrop {
  @apply flex fixed bg-black bg-opacity-80 z-10 w-screen h-screen left-0 top-0;
}
</style>
