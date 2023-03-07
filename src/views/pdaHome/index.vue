<template>
  <div>
    <VeeForm
      @submit="signin"
      :initial-values="loginInfo"
      :validation-schema="schema"
      class="pda-home-wrap"
    >
      <a-icon name="Pdalogo" />
      <div class="input-wrap my-40">
        <label class="label">아이디</label>
        <FieldForm name="email" type="text" class="input" />
        <ErrorMessage name="email" style="color: #f07474" />
      </div>
      <div class="input-wrap">
        <label class="label">비밀번호</label>
        <FieldForm name="password" type="password" class="input" />
        <ErrorMessage name="password" style="color: #f07474" />
      </div>

      <div class="checkbox-wrap">
        <input type="checkbox" id="saveid" class="saveid mr-8" />
        <label for="saveid" class="saveid-label">아이디 저장</label>
      </div>

      <div class="input-wrap">
        <button type="submit" class="login-btn">로그인</button>
      </div>
    </VeeForm>
  </div>
</template>

<script>
import { reactive, toRefs, inject, computed, onMounted } from 'vue'
import AIcon from '@/components/atoms/aIcon'
import { useHead } from '@vueuse/head'

export default {
  name: 'home_index',
  components: {
    AIcon,
  },
  setup() {
    const store = inject('store')
    const router = inject('router')
    const state = reactive({
      title: 'PDA-SignIn',
      loginInfo: {
        email: '',
        password: '',
      },
      loginBtnFlag: true,
      saveLoginInfo: {
        id: '',
        password: '',
      },
    })
    useHead({
      title: computed(() => state.title),
    })
    onMounted(() => {
      const loggedIn = JSON.parse(localStorage.getItem('loggedIn'))
      const savedUserId = sessionStorage.getItem('savedUserId')

      if (loggedIn) {
        router.push({ name: 'Pdamain' })
      } else {
        router.push({ name: 'Pdahome' })
      }

      if (savedUserId) state.loginInfo.email = savedUserId
    })

    const schema = {
      email: 'required',
      password: 'required',
    }
    const signin = async user => {
      if (!state.loginBtnFlag) return
      state.loginBtnFlag = false

      user.email = user.email.trim()
      user.password = user.password.trim()
      await store.dispatch('Auth/signin', user)
      const loggedIn = JSON.parse(localStorage.getItem('loggedIn'))
      const whereWego = loggedIn ? '/pda/main' : '/'
      router.push({ path: whereWego })

      const isSaveInfo = document.getElementById('saveid').checked
      // 아이디저장 체크O && 로그인 O && 아이디담아두기(수정필요)
      isSaveInfo &&
        loggedIn &&
        sessionStorage.setItem('savedUserId', user.email)

      state.loginBtnFlag = true
    }

    return {
      ...toRefs(state),
      signin,
      schema,
    }
  },
}
</script>

<style lang="scss" scoped>
.pda-home-wrap {
  @apply w-full flex flex-col items-center py-20 bg-hive-bluegray-800 tracking-tighter h-640;
}
.input-wrap {
  @apply flex flex-col flex-wrap;
  width: 90%;
}
.input {
  @apply flex w-full h-52 bg-hive-bluegray-700 rounded-md text-hive-bluegray-100 px-15 mt-4 hover:shadow-default;
}
.label {
  @apply text-hive-white text-sm pb-12;
}
.checkbox-wrap {
  @apply flex flex-wrap justify-end items-center  text-sm text-hive-bluegray-500 mt-20 cursor-pointer;
  width: 90%;
}
.login-btn {
  @apply flex items-center justify-center mt-40 w-full h-68 text-hive-bluegray-800 text-center bg-hive-teal-500 rounded-md;
}
</style>
