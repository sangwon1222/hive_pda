<template>
  <div class="space-y-8">
    <a-label :for="name" :text="label" v-if="label" :required="isRequired" />
    <div :class="computedClasses">
      <a-icon
        v-if="iconName"
        :name="iconName"
        class="icon"
        :disabled="readOnly"
      />
      <input
        :id="name"
        :name="name"
        type="text"
        :value="inputValue"
        :placeholder="inputPlaceholder"
        :readonly="readOnly"
        class="input"
        autocomplete="off"
        @input="numberWithCommas($event)"
        @keypress.enter.prevent
      />
    </div>
  </div>
</template>
<script>
import { computed, inject, nextTick, reactive, toRefs, watchEffect } from 'vue'
import { useField } from 'vee-validate'
import AIcon from '@/components/atoms/aIcon'
import ALabel from '@/components/atoms/aLabel'
export default {
  name: 'mInput',
  components: { ALabel, AIcon },
  props: {
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    iconDirection: {
      type: String,
      default: '',
    },
    iconName: {
      type: String,
    },
    rules: {
      type: String,
      default: '',
    },
    isPrice: {
      type: Boolean,
      default: false,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    isRequired: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const $t = inject('t')
    const $toast = inject('toast')
    const state = reactive({
      errorState: '',
    })

    const inputPlaceholder = computed(() => {
      return props.placeholder ? props.placeholder : $t('placeholder.default')
    })

    const computedRule = computed(() => {
      return props.readOnly ? undefined : props.rules
    })

    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
      validate,
      resetField,
    } = useField(props.name, computedRule, {
      initialValue: props.modelValue.toLocaleString(),
    })

    watchEffect(() => {
      handleChange(props.modelValue)
      // validateInput()
    })

    const computedClasses = computed(() => {
      const error = errorMessage.value ? 'error' : ''
      const readOnly = props.readOnly ? 'read-only' : ''
      const iconClass =
        props.iconName && props.iconDirection === 'right'
          ? 'if-icon-right'
          : props.iconName
          ? 'if-icon-left'
          : ''
      const darkMode = props.darkMode ? 'dark-mode' : ''

      return ['input-wrapper', error, readOnly, iconClass, darkMode]
    })

    const validateInput = async () => {
      const { errors, valid } = await validate()
      if (!valid && state.errorState !== errors[0]) {
        $toast.error(errors[0])
      } else if (valid) {
        $toast.clear()
      }
      state.errorState = errors[0]
    }

    function comma(str) {
      // TODO: 소수점 뒤의 셋째자리부터는 입력시 지워야 한다.
      return (
        str
          .replace(/[^-.0-9]/g, '')
          // .replace(/^\d*[.]\d{3}/, '')
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
      )
    }

    function uncomma(str) {
      str = String(str)
      return str.replace(/,+/g, '')
    }

    const numberWithCommas = event => {
      const value = event.target.value

      // 이벤트 시작 커서 위치
      let cursor = event.target.selectionStart

      inputValue.value = props.type !== 'number' ? value : comma(uncomma(value))

      const convertedValue =
        props.type !== 'number'
          ? inputValue.value
          : isNaN(parseFloat(uncomma(inputValue.value)))
          ? null
          : parseFloat(uncomma(inputValue.value))
      emit('update:modelValue', convertedValue)

      if (props.type === 'number') {
        // input에 들어간 콤마 갯수 찾기
        const targetValuesCommaCnt = (value.match(/,/g) || []).length
        const inputValuesCommaCnt = (inputValue.value.match(/,/g) || []).length

        if (targetValuesCommaCnt > inputValuesCommaCnt) cursor--
        if (targetValuesCommaCnt < inputValuesCommaCnt) cursor++
        if (cursor === -1) cursor = 0

        // 맨뒤로 이동된 커서를 인풋 이벤트가 시작할 때의 위치로 이동
        nextTick(() => {
          event.target.value = inputValue.value
          event.target.setSelectionRange(cursor, cursor)
        })
      }

      validateInput()
    }

    return {
      ...toRefs(state),
      inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
      computedClasses,
      inputPlaceholder,
      resetField,
      validateInput,
      numberWithCommas,
    }
  },
}
</script>
<style lang="scss" scoped>
.input-wrapper {
  @apply flex border h-38 border-hive-bluegray-300 rounded-md text-hive-bluegray-800 bg-white w-full px-15 hover:border-hive-bluegray-300 hover:shadow-default;

  &:focus-within {
    @apply border-hive-blue-200;
  }

  &.if-icon-left {
    @apply pl-0;

    .input {
      @apply text-right;
    }
  }

  &.if-icon-right {
    @apply flex-row-reverse pr-0;
  }

  &.error {
    @apply border-hive-status-100 hover:border-hive-status-100;

    .icon {
      @apply text-hive-bluegray-500;
    }

    &:focus-within {
      @apply border-hive-status-100;
    }
  }

  &.read-only {
    @apply bg-hive-bluegray-100 border-hive-bluegray-300 text-hive-bluegray-500 hover:border-hive-bluegray-300 hover:shadow-none;

    &:focus-within {
      @apply border-hive-bluegray-300;
    }

    .icon {
      @apply text-hive-bluegray-500;
    }
  }

  .input {
    @apply w-full  text-xsm bg-transparent;
  }

  .icon {
    @apply self-center mx-15 text-hive-blue-200 min-w-min;
  }
}

.dark-mode {
  @apply bg-hive-dark-mode-100 text-white;

  .icon {
    @apply text-white;
  }

  &:focus-within {
    .icon {
      @apply text-hive-blue-200;
    }
  }

  &.read-only {
    @apply bg-hive-dark-mode-200 border-hive-bluegray-500 hover:border-hive-bluegray-500;

    &:focus-within {
      @apply border-hive-bluegray-500;

      .icon {
        @apply text-hive-bluegray-500;
      }
    }
  }

  &.error {
    @apply border-hive-status-100 bg-hive-dark-mode-300;

    .icon {
      @apply text-white;
    }

    &:focus-within {
      @apply border-hive-status-100;
    }
  }
}
</style>
