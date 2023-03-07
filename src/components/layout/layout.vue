<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script>
import DefaultLayout from '@/components/layout/defaultLayout.vue'
import ClearLayout from '@/components/layout/clearLayout.vue'
import PdaLayout from '@/components/layout/pdaLayout.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'layout_layout',
  components: {
    DefaultLayout,
    ClearLayout,
    PdaLayout,
  },
  setup() {
    const route = useRoute()
    const layout = computed(() => {
      const layouts = {
        DefaultLayout: 'DefaultLayout',
        PdaLayout: 'PdaLayout',
        ClearLayout: 'ClearLayout',
      }
      return layouts[route.meta.layout] ?? 'DefaultLayout'
    })

    return {
      layout,
    }
  },
}
</script>

<style lang="scss" scoped></style>
