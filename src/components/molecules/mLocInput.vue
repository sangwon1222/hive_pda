<template>
  <div :class="computedClasses">
    <input
      :name="`from${name}`"
      type="text"
      :value="fromLoc"
      @input="onInput($event.target.value, 0)"
      :disabled="disabled"
      placeholder="A-00-00-00"
    />
    <span class="hyphen">-</span>
    <input
      :name="`to${name}`"
      type="text"
      :value="toLoc"
      @input="onInput($event.target.value, 1)"
      :disabled="disabled"
      placeholder="A-00-00-00"
    />
  </div>
</template>

<script>
import { computed, inject } from 'vue'
import { useField } from 'vee-validate'

export default {
  name: 'mLocInput',
  props: {
    name: {
      type: String,
    },
    modelValue: {
      type: Array,
    },
    disabled: {
      type: Boolean,
    },
    required: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const toast = inject('toast')

    const computedClasses = computed(() => {
      const disabled = props.disabled ? 'disabled' : ''
      const fromError = fromErrorMsg.value ? 'error' : ''
      const toError = toErrorMsg.value ? 'error' : ''
      return ['loc', disabled, fromError, toError]
    })

    const computedRule = computed(() => {
      return props.required ? 'required' : ''
    })

    const {
      value: fromLoc,
      validate: fromValidate,
      errorMessage: fromErrorMsg,
    } = useField(`from${props.name}`, computedRule, {
      initialValue: props.modelValue[0],
    })

    const {
      value: toLoc,
      validate: toValidate,
      errorMessage: toErrorMsg,
    } = useField(`to${props.name}`, computedRule, {
      initialValue: props.modelValue[1],
    })

    const onValidate = async index => {
      let validate = null
      if (index) {
        validate = await toValidate()
      } else {
        validate = await fromValidate()
      }

      if (!validate.valid) toast.error(validate.errors[0])
      else if (!validate.valid) toast.error(validate.errors[0])
      else toast.clear()
    }

    const onInput = (value, index) => {
      const convertedValue = value
        .replace(/(^[A-Z])([0-9]{2})([0-9]{2})([0-9]{2})$/, '$1-$2-$3-$4')
        .replace('--', '-')
      if (index) toLoc.value = convertedValue
      else fromLoc.value = convertedValue
      emit('update:modelValue', convertedValue, index)
      onValidate(index)
    }

    return {
      computedClasses,
      onValidate,
      onInput,
      fromLoc,
      fromValidate,
      toLoc,
      toValidate,
    }
  },
}
</script>

<style lang="scss" scoped>
input {
  @apply outline-none bg-transparent text-hive-bluegray-800 body-2 w-71 h-14 leading-14 placeholder-hive-bluegray-500;
}

.loc {
  @apply inline-flex border border-hive-bluegray-300 rounded-md p-12 hover:shadow-default;

  .hyphen {
    @apply text-hive-blue-200 mx-3 h-14 leading-14;
  }

  &:focus-within {
    @apply border-hive-blue-200;
  }

  &:hover {
    input {
      @apply placeholder-hive-bluegray-600;
    }
  }

  &.disabled {
    @apply hover:shadow-none bg-hive-bluegray-100;

    &:hover {
      input {
        @apply placeholder-hive-bluegray-500;
      }
    }
  }

  &.error {
    @apply border-hive-status-100;
  }
}
</style>
