<template>
  <table :class="tableClasses">
    <thead>
      <th v-for="(item, index) in header" :key="index">
        {{ item }}
      </th>
    </thead>
    <tbody>
      <slot name="table-body" />
    </tbody>
  </table>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'

export default {
  props: {
    header: {
      type: Array,
    },
    orderForm: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const state = reactive({
      tableClasses: computed(() => {
        const orderForm = props.orderForm ? 'table-wrap-orderForm' : ''
        return ['table-wrap', orderForm]
      }),
    })

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="scss" scoped>
.table-wrap {
  @apply w-full;
  thead {
    th {
      @apply h6 text-left bg-hive-navy-200 text-white border-0.5 border-white p-14;
      &:first-child {
        @apply rounded-l-md;
      }
      &:last-child {
        @apply rounded-r-md;
      }
    }
  }
  tbody {
    ::v-slotted(tr) {
      td {
        @apply p-14 text-hive-bluegray-800 body-2 bg-hive-gray-700 border-0.7 border-white;
        &:first-child {
          @apply rounded-l-md;
        }
        &:last-child {
          @apply rounded-r-md;
        }
      }
    }
  }
  &-orderForm {
    thead {
      th {
        &:nth-child(1),
        &:nth-child(3) {
          width: 35%;
        }
        &:nth-child(2),
        &:nth-child(4) {
          width: 15%;
        }
      }
    }
    tbody {
      ::v-slotted(tr) {
        td {
          @apply p-0 bg-white;
        }
      }
    }
  }
}
</style>
