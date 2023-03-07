<template>
  <div class="space-y-8">
    <a-label v-if="label" :text="label" :for="id" :required="isRequired" />
    <div
      class="select-wrap"
      v-click-outside="outsideClick"
      :class="computedClasses"
    >
      <div
        class="select-area"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
      >
        <input
          v-if="searchable"
          ref="searchInput"
          :id="id"
          type="text"
          class="w-full h-38"
          :placeholder="placeholder"
          @input="callApi"
          @keypress.enter.prevent
        />
        <div
          class="selected-label"
          v-if="!searchable"
          @mousedown.self="doSearchable"
        >
          {{
            modelValue[optionValueKey]
              ? modelValue[optionLabelKey]
              : $t('placeholder.default')
          }}
        </div>
        <div class="flex items-center">
          <a-icon v-if="isLoading" name="Spinner" class="w-24 h-24" />
          <a-icon
            v-if="modelValue[optionValueKey]"
            name="Delete"
            class="icon delete"
            :disabled="disabled"
            @click="resetValue"
          />
          <a-icon
            name="ChevronDown"
            class="icon"
            :class="chevronIconClasses"
            :disabled="disabled"
          />
        </div>
      </div>
      <template v-if="isOpen && !disabled">
        <ADropdown
          :options="options"
          class="drop-down"
          @click-item="selectItem"
          :option-label-key="optionLabelKey"
          :option-value-key="optionValueKey"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, inject, computed, ref } from 'vue'
import { useField } from 'vee-validate'
import ADropdown from '@/components/atoms/aDropdown.vue'
import ALabel from '@/components/atoms/aLabel.vue'
import AIcon from '@/components/atoms/aIcon.vue'
import vClickOutside from 'click-outside-vue3'
import { debounce } from 'lodash'
import Api from '../../http'

export default {
  name: 'mCombo',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    ADropdown,
    ALabel,
    AIcon,
  },
  props: {
    searchParamKey: {
      type: String,
    },
    searchApi: {
      type: String,
    },
    additionalParams: {
      type: Object,
    },
    name: { type: String },
    modelValue: {
      type: Object,
    },
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
      type: String,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const $t = inject('t')
    const toast = inject('toast')

    const state = reactive({
      isOpen: false,
      isError: false,
      computedClasses: computed(() => {
        const error = state.isError ? 'error' : ''
        const disabled = props.disabled ? 'disabled' : ''
        return [error, disabled]
      }),
      chevronIconClasses: computed(() => {
        const isDropdownOpen = state.isOpen && !props.disabled ? 'open' : ''
        return [isDropdownOpen]
      }),
      options: [],
      searchable: false,
      placeholder: $t('placeholder.default'),
      searchText: '',
      isLoading: false,
    })
    const searchInput = ref(null)

    const { handleChange, validate } = useField(props.name, props.rules, {
      initialValue: props.modelValue[props.optionValueKey],
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

    const resetOptions = () => {
      state.options = []
    }

    const openDropdown = () => {
      state.isOpen = true
    }

    const closeDropdown = () => {
      state.isOpen = false
      state.searchable = false
    }
    const outsideClick = () => {
      state.searchable = false
      closeDropdown()
    }

    const doSearchable = () => {
      state.searchable = true
      openDropdown()
      setTimeout(() => {
        searchInput.value.focus()
      })
    }

    const callApi = debounce(async e => {
      state.isLoading = true
      if (!e.target.value) {
        resetOptions()
        handleChange(null)
        state.isLoading = false
        return
      }
      state.searchText = e.target.value
      const params = {
        [props.searchParamKey]: e.target.value,
        ...props.additionalParams,
      }
      const { data } = await Api(props.searchApi, { params })
      state.options = data
      state.isLoading = false
      openDropdown()
    }, 1000)

    const selectItem = async option => {
      emit('update:modelValue', option)
      emit('selectItem')
      handleChange(option[props.optionValueKey])
      await validateSelect()
      closeDropdown()
      state.searchable = false
    }

    const resetValue = async () => {
      emit('update:modelValue', {
        [props.optionLabelKey]: $t('placeholder.default'),
        [props.optionValueKey]: null,
      })
      emit('resetValue')
      handleChange(null)
      closeDropdown()
      await validateSelect()
    }

    return {
      ...toRefs(state),
      outsideClick,
      doSearchable,
      searchInput,
      callApi,
      selectItem,
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
  @apply relative rounded-md h-38 border bg-white border-hive-bluegray-300 transition duration-200 ease-in;
  &:focus-within {
    @apply border-hive-blue-200;
  }
  &:hover {
    @apply shadow-default;
  }
  &.error {
    @apply border-hive-status-100;
  }
  &.disabled {
    @apply bg-hive-bluegray-100 text-hive-bluegray-500;
  }
}
.select-area {
  @apply body-2 flex items-center justify-between  rounded-md appearance-none px-12 w-full h-full gap-10;
  &:focus-within {
    @apply border-hive-blue-200;
  }
  // &:hover {
  //   @apply shadow-default border-hive-bluegray-300;
  // }
  span {
    @apply cursor-text;
  }
  input {
    @apply appearance-none body-2 w-full h-full;
    // &:focus-within {
    //   @apply border-hive-blue-200;
    // }
  }
}
.drop-down {
  @apply flex-none absolute mt-4 z-100;
}
.icon {
  transition: transform 0.2s;
  @apply text-hive-lime-200 ml-8;
  &.open {
    @apply transform rotate-180;
  }
  &.delete {
    &:hover {
      @apply transform rotate-180;
    }
  }
}
</style>
