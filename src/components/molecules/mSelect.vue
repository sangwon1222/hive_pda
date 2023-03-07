<template>
  <div class="space-y-8">
    <a-label v-if="label" :text="label" :for="id" :required="isRequired" />
    <div
      class="select-wrap"
      v-click-outside="closeDropdown"
      :class="computedClasses"
    >
      <button
        type="button"
        class="select-area"
        @click="openDropdown"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
      >
        <span :name="name" :id="id" class="selected-label">
          {{ selectedLabel }}
        </span>
        <a-icon
          name="ChevronDown"
          class="icon"
          :class="iconClasses"
          :disabled="disabled"
        />
      </button>
      <ADropdown
        :options="options"
        v-if="isOpen && !disabled"
        class="drop-down"
        :optionLabelKey="optionLabelKey"
        :optionValueKey="optionValueKey"
        @click-item="selectItem"
      />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, inject, computed, watchEffect } from 'vue'
import { useField } from 'vee-validate'
import ADropdown from '@/components/atoms/aDropdown.vue'
import ALabel from '@/components/atoms/aLabel.vue'
import AIcon from '@/components/atoms/aIcon.vue'
import vClickOutside from 'click-outside-vue3'

export default {
  name: 'mSelect',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    ADropdown,
    ALabel,
    AIcon,
  },
  props: {
    modelValue: {
      type: [String, Number],
    },
    options: {
      type: Array,
    },
    name: { type: String },
    optionLabelKey: {
      type: String,
    },
    optionValueKey: {
      type: String,
    },
    label: {
      type: String,
      default: '',
    },
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isRequired: {
      type: Boolean,
    },
    rules: {
      tyep: String,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const toast = inject('toast')
    const state = reactive({
      isOpen: false,
      isError: false,
      computedClasses: computed(() => {
        const error = state.isError ? 'error' : ''
        const disabled = props.disabled ? 'disabled' : ''
        return [error, disabled]
      }),
      iconClasses: computed(() => {
        const rotate = state.isOpen && !props.disabled ? 'open' : ''
        return [rotate]
      }),
    })
    const {
      value: selectedValue,
      handleChange,
      validate,
    } = useField(props.name, props.rules, {
      initialValue: props.modelValue,
    })

    // * method
    const closeDropdown = () => {
      state.isOpen = false
    }

    const openDropdown = () => {
      state.isOpen = true
    }

    const computedLabel = selectedValue => {
      const isNullish = !selectedValue.value
      state.selectedLabel = isNullish
        ? props.options[0][props.optionLabelKey]
        : props.options.filter(
            option => option[props.optionValueKey] === selectedValue.value,
          )[0][props.optionLabelKey]
    }

    const selectItem = option => {
      closeDropdown()
      handleChange(option[props.optionValueKey])
      computedLabel(selectedValue)
      validateSelect()
      emit('update:modelValue', selectedValue.value)
      emit('selectedItem', {
        value: option[props.optionValueKey],
        labele: option[props.optionLabelKey],
      })
    }

    watchEffect(() => {
      handleChange(props.modelValue)
      const isNullish = !props.modelValue
      state.selectedLabel = isNullish
        ? props.options[0][props.optionLabelKey]
        : props.options.filter(
            option => option[props.optionValueKey] === props.modelValue,
          )[0][props.optionLabelKey]
      // validateSelect()
    })

    const validateSelect = async () => {
      const { errors, valid } = await validate()
      if (!valid) {
        state.isError = true
        toast.error(errors[0])
        return
      }
      state.isError = false
    }

    const resetValue = () => {
      computedLabel({ value: null })
    }

    computedLabel(selectedValue)
    // validateSelect()

    return {
      ...toRefs(state),
      selectItem,
      openDropdown,
      closeDropdown,
      resetValue,
    }
  },
}
</script>

<style lang="scss" scoped>
.selected-label {
  @apply block overflow-hidden w-4/5 text-left overflow-ellipsis;
}
.select-wrap {
  @apply relative border rounded-md bg-white border-hive-bluegray-300 transition duration-200 ease-in h-38 hover:border-hive-bluegray-300 hover:shadow-default;
  &:focus-within {
    @apply border-hive-blue-200;
  }

  &.error {
    @apply border-hive-status-100;
  }
  &.disabled {
    @apply bg-hive-bluegray-100 text-hive-bluegray-500;
  }
}
.select-area {
  @apply body-2 flex items-center justify-between rounded cursor-default appearance-none p-12 w-full h-full;
  input {
    @apply cursor-default h-38;
  }
}
.drop-down {
  @apply flex-none absolute mt-4 z-10;
}
.icon {
  transition: transform 0.2s;
  @apply text-hive-lime-200 ml-8;
  &.open {
    transform: rotate(180deg);
  }
}
</style>
