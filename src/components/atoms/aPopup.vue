<template>
  <div class="popup-bg" @click="$emit('iconClick')">
    <div class="popup-wrap">
      <div class="guide-text" v-html="guideText" />
      <div class="btn-wrap mt-56">
        <button class="popup-btn bg-hive-bluegray-200" @click="$emit('close')">
          {{ activeFlag ? '닫기' : '확인' }}
        </button>
        <button
          v-if="activeFlag"
          class="popup-btn bg-hive-blue-200 ml-12"
          @click="$emit('action')"
        >
          {{ activeText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'

export default {
  name: 'aPopup',
  props: {
    text: {
      type: String,
    },
    activeFlag: {
      type: Boolean,
    },
    activeText: {
      type: String,
    },
  },
  setup(props) {
    const state = reactive({
      guideText: '',
    })

    onMounted(() => {
      setColorText()
    })

    const setColorText = () => {
      state.guideText = props.text
        .replaceAll('(', '<span class="text-hive-teal-500">')
        .replaceAll(')', '</span>')
    }

    return {
      ...toRefs(state),
      setColorText,
    }
  },
}
</script>

<style lang="scss" scoped>
.popup-bg {
  @apply fixed flex justify-center items-center top-0 left-0 w-full h-full bg-hive-bluegray-900;
}
.popup-wrap {
  @apply p-32 max-w-302 rounded-xl bg-hive-white;
}
.btn-wrap {
  @apply flex justify-center;
}
.popup-btn {
  @apply w-109 h-72 rounded-md;
}
.guide-text {
  @apply text-xl font-bold tracking-tighter;
}
</style>
