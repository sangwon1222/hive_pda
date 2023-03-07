<template>
  <div class="flex flex-wrap justify-between w-full bg-hive-white">
    <div class="px-10 py-24">{{ title }}</div>

    <div class="flex">
      <a-icon
        v-if="activeKeyBoard"
        class="overflow-hidden w-72 h-72 flex justify-center items-center"
        :class="computedClass"
        @click="$emit('toggleKeyboard')"
        name="KeyboardIcon"
      />
      <button
        :type="type"
        :class="activeBtn ? `bg-hive-blue-200` : `bg-hive-bluegray-400`"
        class="save-btn"
        @click="activeBtn ? $emit('save') : null"
      >
        {{ buttonLabel }}
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import AIcon from '@/components/atoms/aIcon'
export default {
  name: 'aPdaHeader',
  components: {
    AIcon,
  },
  props: {
    title: {
      type: String,
    },
    buttonLabel: {
      type: String,
    },
    type: {
      type: String,
      default: 'submit',
    },
    activeBtn: {
      type: Boolean,
    },
    activeKeyBoard: {
      type: Boolean,
      default: false,
    },
    initKeyboardFlag: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const state = reactive({
      computedClass: computed(() =>
        props.initKeyboardFlag ? 'able' : 'disable',
      ),
    })
    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
.save-btn {
  @apply w-72 text-hive-white;
}
.disable {
  animation: forwards disableAny 0.2s;
}
.able {
  animation: forwards ableAny 0.2s;
}
@keyframes disableAny {
  0% {
    opacity: 100%;
    transform: scale(100%);
  }
  45% {
    opacity: 100%;
    transform: scale(80%);
  }
  80% {
    opacity: 50%;
    transform: scale(100%);
  }
  100% {
    opacity: 50%;
    transform: scale(80%);
  }
}
@keyframes ableAny {
  0% {
    opacity: 50%;
    transform: scale(80%);
  }
  45% {
    opacity: 50%;
    transform: scale(100%);
  }
  80% {
    opacity: 100%;
    transform: scale(80%);
  }
  100% {
    opacity: 100%;
    transform: scale(100%);
  }
}
</style>
