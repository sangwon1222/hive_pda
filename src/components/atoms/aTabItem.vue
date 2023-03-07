<template>
  <div>
    <slot />
  </div>
</template>

<script>
// TODO: 추후 탭 내용 변경시 트랜지션 적용
import { reactive, toRefs } from 'vue'

export default {
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

<style lang="scss" scoped></style>
