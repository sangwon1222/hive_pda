<template>
  <!-- label compoment영역 -->
  <div class="date-wrap" :class="computedClass">
    <ADropdown
      v-if="isOpen && !disabled"
      :options="options"
      optionLabelKey="optionLabelKey"
      optionValueKey="optionValueKey"
      class="drop-down"
      @click-item="selectedOpt"
      v-click-outside="closeDropdown"
    />

    <DatePicker
      class="inline-block h-full"
      :class="computedClass"
      v-model="rangeDate"
      :masks="dateFormat"
      :popover="{ visibility: 'hidden' }"
      is-range
    >
      <template v-slot="{ inputValue, inputEvents }">
        <div class="flex items-center justify-center h-full">
          <input
            :value="inputValue.start"
            v-on="inputEvents.start"
            placeholder="YY-MM"
            :readonly="disabled"
          />
          <span class="m-3">-</span>
          <input
            :value="inputValue.end"
            v-on="inputEvents.end"
            placeholder="YY-MM"
            :readonly="disabled"
          />

          <a-icon
            name="Calendar"
            @click="showOptionDate"
            class="iconClass"
            :class="computedClass"
          />
        </div>
      </template>
    </DatePicker>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import AIcon from '@/components/atoms/aIcon.vue'
import ADropdown from '@/components/atoms/aDropdown.vue'
import dayjs from 'dayjs'
import { DatePicker } from 'v-calendar'
import vClickOutside from 'click-outside-vue3'

export default {
  name: 'mMonthPicker',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    AIcon,
    ADropdown,
    DatePicker,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const state = reactive({
      //날짜포맷
      dateFormat: {
        input: 'YY-MM',
      },
      //기간선택
      rangeDate: {
        start: null,
        end: null,
      },

      computedClass: computed(() => {
        const disabled = props.disabled ? 'disabled' : ''

        return disabled
      }),
      isOpen: false, //dropDown컴포넌트 제어변수
      options: [
        {
          optionValueKey: 30,
          optionLabelKey: '최근 1개월',
        },
        {
          optionValueKey: 60,
          optionLabelKey: '최근 2개월',
        },
        {
          optionValueKey: 90,
          optionLabelKey: '최근 3개월',
        },
      ],
    })

    const selectedOpt = (e, params) => {
      const today = dayjs().toDate()

      state.isOpen = false

      const options = {
        30: () =>
          (state.rangeDate = {
            start: dayjs().subtract(1, 'month').toDate(),
            end: today,
          }),
        60: () =>
          (state.rangeDate = {
            start: dayjs().subtract(2, 'month').toDate(),
            end: today,
          }),
        90: () =>
          (state.rangeDate = {
            start: dayjs().subtract(3, 'month').toDate(),
            end: today,
          }),
      }

      options[params.optionValueKey]?.()
    }
    const showOptionDate = () => {
      state.isOpen = !state.isOpen
    }

    const closeDropdown = () => {
      state.isOpen = false
    }

    return {
      ...toRefs(state),
      closeDropdown,
      selectedOpt,
      showOptionDate,
    }
  },
}
</script>

<style lang="scss" scoped>
input {
  @apply appearance-none body-2 w-41 h-14;
}

.date-wrap {
  @apply h-38 relative rounded-lg border-1 pl-12 border-hive-bluegray-300 text-hive-bluegray-800;
  &:hover {
    @apply border-hive-bluegray-400 text-hive-bluegray-600 shadow;
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
  @apply w-144 h-120 absolute left-0 top-45 z-50;
}
.iconClass {
  @apply inline-block ml-13 text-hive-blue-200;
  &.disabled {
    @apply text-hive-bluegray-500;
  }
}
</style>
