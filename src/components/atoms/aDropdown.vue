<template>
  <ul tabindex="-1" role="listbox" class="list-box">
    <transition-group name="drop-down" mode="out-in" v-if="options.length">
      <template
        v-for="(option, index) of options"
        :key="`${option[optionLabelKey]}-${index}`"
      >
        <li
          :tabindex="0"
          role="option"
          class="option-item"
          @click="$emit('click-item', option)"
        >
          {{ option[optionLabelKey] }}
        </li>
      </template>
    </transition-group>
    <li v-else :tabindex="0" role="option" class="option-item">
      검색결과가 없습니다.
    </li>
  </ul>
</template>

<script>
export default {
  name: 'aDropdown',
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      },
    },
    optionLabelKey: {
      type: String,
    },
    optionValueKey: {
      type: String,
    },
    searchText: {
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
.list-box {
  @apply body-2 shadow-default bg-white p-6 rounded-md text-hive-bluegray-600 w-full max-h-300 overflow-y-scroll;
}
.option-item {
  @apply cursor-default rounded-md px-14 py-12 transition duration-200 ease-in break-words;
  &:hover {
    @apply bg-hive-blue-400 text-hive-bluegray-800;
  }
}
</style>
