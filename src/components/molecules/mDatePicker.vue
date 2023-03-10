<template>
  <div>
    <a-label :for="title" :text="label"></a-label>
    <div class="date-wrap" :class="computedClass">
      <DatePicker
        ref="datepicker"
        class="flex h-full w-full"
        :class="computedClass"
        :model-value="modelValue"
        @update:modelValue="changeDate"
        :masks="dateFormat"
        :popover="{ visibility: disabled ? 'hidden' : 'click' }"
        is-range
      >
        <template v-slot="{ inputValue, inputEvents, updateValue }">
          <ADropdown
            v-if="isOpen && !disabled"
            :options="options"
            optionLabelKey="optionLabelKey"
            optionValueKey="optionValueKey"
            class="drop-down"
            @click-item="
              (e, params) => {
                updateValue(selectedOpt(e, params))
              }
            "
            v-click-outside="closeDropdown"
          />
          <div class="flex items-center justify-between w-full">
            <div>
              <input
                :value="inputValue.start"
                v-on="inputEvents.start"
                placeholder="YY-MM-DD"
                :readonly="disabled"
                @input="
                  updateValue($event.target.value, {
                    formatInput: false,
                    hidePopover: false,
                  })
                "
              />
              <span class="m-3">-</span>
              <input
                :value="inputValue.end"
                v-on="inputEvents.end"
                placeholder="YY-MM-DD"
                :readonly="disabled"
                @input="
                  updateValue($event.target.value, {
                    formatInput: false,
                    hidePopover: false,
                  })
                "
              />
            </div>

            <div>
              <a-icon
                name="Calendar"
                @click="showOptionDate"
                class="iconClass"
                :class="computedClass"
              />

              <a-icon
                v-if="modelValue"
                name="Delete"
                @click="resetDate"
                class="iconClass"
                :class="computedClass"
              />
            </div>
          </div>
        </template>
      </DatePicker>
    </div>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import AIcon from '@/components/atoms/aIcon.vue'
import ADropdown from '@/components/atoms/aDropdown.vue'
import ALabel from '@/components/atoms/aLabel.vue'
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'
import vClickOutside from 'click-outside-vue3'
// import { useField } from 'vee-validate'

export default {
  name: 'mDatePicker',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    AIcon,
    ADropdown,
    DatePicker,
    ALabel,
  },
  props: {
    modelValue: {
      type: [Object, String],
    },
    label: {
      type: String,
    },
    title: {
      type: String,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
    isWhite: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    rule: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      //????????????
      dateFormat: {
        input: 'YY-MM-DD',
      },
      //????????????
      rangeDate: {
        start: null,
        end: null,
      },
      isHover: false,
      datepicker: null,

      computedClass: computed(() => {
        const disabled = props.disabled ? 'disabled' : ''
        const isWhite = props.isWhite ? 'bg-hive-gray-700' : 'bg-white'
        return [disabled, isWhite]
      }),

      isOpen: false, //dropDown???????????? ????????????
      options: [
        {
          optionValueKey: 0,
          optionLabelKey: '??????',
        },
        {
          optionValueKey: 1,
          optionLabelKey: '??????',
        },
        {
          optionValueKey: 7,
          optionLabelKey: '?????? 1??????',
        },
        {
          optionValueKey: 30,
          optionLabelKey: '?????? ??? ???',
        },
        {
          optionValueKey: 60,
          optionLabelKey: '?????? 2??????',
        },
        {
          optionValueKey: 90,
          optionLabelKey: '?????? 3??????',
        },
      ],
    })
    // const { handleChange } = useField(props.name)
    // const { handleChange, validate } = useField(props.name, props.rule, {
    //   initialValue: props.modelValue,
    // })
    //???????????? ????????? ?????? ??? ??????
    const changeInputValue = params => {
      return params
    }
    const selectedOpt = (e, params) => {
      const today = dayjs().toDate()
      state.isOpen = false
      const options = {
        0: () => ({ start: today, end: today }),
        1: () => ({
          start: dayjs().subtract(1, 'day').toDate(),
          end: today,
        }),
        7: () => ({
          start: dayjs().subtract(1, 'week').toDate(),
          end: today,
        }),

        30: () => ({
          start: dayjs().subtract(1, 'month').toDate(),
          end: today,
        }),
        60: () => ({
          start: dayjs().subtract(2, 'month').toDate(),
          end: today,
        }),
        90: () => ({
          start: dayjs().subtract(3, 'month').toDate(),
          end: today,
        }),
      }

      return options[params.optionValueKey]?.()
    }

    const showOptionDate = () => {
      0
      state.isOpen = !state.isOpen
    }

    const closeDropdown = () => {
      state.isOpen = false
    }
    const changeDate = date => {
      const rangeDate = {
        start: date.start ? dayjs(date.start).format('YY-MM-DD') : null,
        end: date.end ? dayjs(date.end).format('YY-MM-DD') : null,
      }

      emit('update:modelValue', rangeDate)
      return rangeDate
    }

    const resetDate = () => {
      state.rangeDate = {
        start: null,
        end: null,
      }
      emit('update:modelValue', null)
    }
    return {
      ...toRefs(state),
      changeInputValue,
      closeDropdown,
      changeDate,
      showOptionDate,
      selectedOpt,
      // selectedDate,
      resetDate,
    }
  },
}
</script>

<style lang="scss" scoped>
input {
  @apply body-2 w-64 h-14;
}

.date-wrap {
  @apply h-38 rounded-md px-12 mt-8 border-hive-bluegray-300 text-hive-bluegray-800 border relative;

  &:hover {
    @apply border-hive-bluegray-300 text-hive-bluegray-600 shadow-default;
  }
  &:focus-within {
    @apply border-hive-blue-200 text-hive-bluegray-800;
  }
  &.disabled {
    @apply text-hive-bluegray-500 bg-hive-bluegray-100 hover:border-hive-blue-300;
  }
  &.error {
    @apply border-hive-status-100 hover:border-hive-status-100;
  }
}

.drop-down {
  @apply w-190 h-240 absolute left-0 top-45 z-50;
}
.iconClass {
  @apply inline-block ml-13 text-hive-blue-200;
  &.disabled {
    @apply text-hive-bluegray-500;
  }
}
.flex-center {
  @apply flex items-center justify-center;
}
</style>
