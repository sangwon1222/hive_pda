<template>
  <div class="pda-header">
    <a-icon name="pda-header-icon" class="w-60 h-full px-20" @click="goBack" />
    <p class="title">{{ warehouseInfo.warehouseName }}</p>

    <button @click="refModal.open()" class="flex items-center px-20">
      <div class="text-hive-lime-100">{{ id }}</div>
      <a-icon name="logout" class="ml-10" />
    </button>
  </div>

  <div class="content-wrap">
    <slot></slot>
  </div>

  <a-modal ref="refModal">
    <template #default>
      <div
        class="bg-white w-256 h-220 rounded-xl flex flex-col gap-20 px-30 py-30"
      >
        <div class="text">
          <p class="text-hive-teal-600 inline">로그아웃</p>
          하시겠습니까?
        </div>
        <div class="flex justify-around w-full">
          <m-button label="닫기" size="small" line @click="refModal.close()" />
          <m-button
            type="button"
            label="로그아웃"
            size="small"
            solid
            @click="signOut"
          />
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { reactive, toRefs, inject, computed, onMounted } from 'vue'
import AIcon from '@/components/atoms/aIcon'
import AModal from '@/components/atoms/aModal'
import mButton from '@/components/molecules/mButton'
export default {
  components: {
    AIcon,
    AModal,
    mButton,
  },
  setup() {
    const user = JSON.parse(localStorage.getItem('username'))
    const store = inject('store')
    const router = inject('router')
    const state = reactive({
      refModal: null,
      warehouseList: computed(() => store.getters['CommonApi/warehouseList']),
      id: '',
      warehouseInfo: 0,
    })
    onMounted(() => {
      if (!user) {
        localStorage.clear()
        router.push({ name: 'Pdahome' })
        return
      }
      state.warehouseInfo = state.warehouseList[0]
      state.id = user.split('@')[0]
    })

    const signOut = async () => {
      await store.dispatch('Auth/signout', user)
      router.push({ name: 'Pdahome' })
    }

    const goBack = () => {
      router.push({ name: 'Pdahome' })
      // router.options.history.state.back != '/pda' &&
      //   router.options.history.go(-1)
    }

    return {
      ...toRefs(state),
      goBack,
      signOut,
      user,
    }
  },
}
</script>

<style lang="scss" scoped>
.pda-header {
  @apply flex justify-between items-center  h-55 bg-hive-bluegray-700 text-hive-bluegray-300 tracking-tighter-xsm;
}
.title {
  @apply ml-40 text-center tracking-tighter;
}
.text {
  @apply mb-56 text-center tracking-tighter font-bold text-xl;
}
</style>
