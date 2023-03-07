<template>
  <div @click="fullscreen" id="app-wrap">
    <layout>
      <router-view v-slot="{ Component }">
        <!-- <keep-alive :exclude="['delivery', 'detail', 'index']"> -->
        <component :is="Component" />
        <!-- </keep-alive> -->
      </router-view>
      <loading-page />
    </layout>
  </div>
</template>

<script>
import LoadingPage from '@/components/template/loadingPage'
import { getCurrentInstance, provide, watch } from 'vue'
import Layout from '@/components/layout/layout'

export default {
  components: {
    Layout,
    LoadingPage,
  },
  setup() {
    const app = getCurrentInstance().appContext.config.globalProperties
    provide('i18n', app.$i18n)
    provide('t', app.$t)
    provide('toast', app.$toast)
    provide('router', app.$router)
    provide('route', app.$route)
    provide('store', app.$store)

    const fullscreen = () => {
      if (!document.fullscreenElement)
        document.documentElement.requestFullscreen()
    }
    // * 해당 페이지에 필요한 common api 호출하여 store에 저장.
    watch(
      () => app.$route,
      data => {
        if (data.meta.requiredApi?.length) {
          const commonApiList = [...data.meta.requiredApi]
          app.$store.dispatch('CommonApi/getCommonApi', commonApiList)
        }
      },
    )
    return {
      fullscreen,
    }
  },
}
</script>

<style lang="scss">
@import '~ag-grid-community/src/styles/ag-grid.scss';
@import '~ag-grid-community/src/styles/ag-theme-alpine/sass/ag-theme-alpine-mixin';

#app-wrap {
  @apply overflow-auto h-640;
}

.status {
  @apply inline-block rounded-xl border border-hive-bluegray-700 text-hive-bluegray-700 body-4 px-10 py-8 bg-hive-bluegray-100;

  &-100 {
    @apply border-hive-status-100 bg-hive-status-bg-100 text-hive-status-100;
  }
  &-200 {
    @apply border-hive-status-200 bg-hive-status-bg-200 text-hive-status-200;
  }
  &-300 {
    @apply border-hive-status-300 bg-hive-status-bg-300 text-hive-status-300;
  }
  &-400 {
    @apply border-hive-status-400 bg-hive-status-bg-400 text-hive-status-400;
  }
  &-500 {
    @apply border-hive-status-500 bg-hive-status-bg-500 text-hive-status-500;
  }
  &-600 {
    @apply border-hive-status-600 bg-hive-status-bg-600 text-hive-status-600;
  }
  &-700 {
    @apply border-hive-status-700 bg-hive-status-bg-700 text-hive-status-700;
  }
  &-800 {
    @apply border-hive-bluegray-700 bg-hive-bluegray-100 text-hive-bluegray-700;
  }
}

.ag-theme-alpine {
  /* 참고 https://www.ag-grid.com/vue-grid/themes-customising/ */
  @include ag-theme-alpine(
    (
      grid-size: 6px,
      cell-horizontal-padding: 10px,
      row-height: 40px,
      header-background-color: #28447c,
      header-column-separator: true,
      header-column-separator-width: 1px,
      header-column-separator-height: 100%,
      cell-horizontal-border: solid #fff,
      header-column-separator-color: #d9dce0,
      secondary-border-color: #ededed,
      row-hover-color: #e8f4fe f4fe,
    )
  );

  .ag-row {
    border-left: none;
    border-right: none;
  }

  .ag-header-icon {
    .ag-icon-menu {
      @apply text-hive-lime-200;
    }
  }

  .ag-root-wrapper {
    @apply rounded-md;
  }

  .ag-cell-value {
    @apply inline-block w-full text-xsm font-normal tracking-tighter-sm text-hive-bluegray-800 overflow-hidden;
  }

  .ag-header-cell {
    @apply h6 bg-hive-navy-200 text-white;
  }

  .ag-cell-inline-editing {
    height: auto;
  }
}
</style>
