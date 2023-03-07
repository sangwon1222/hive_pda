import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mixins from './mixins/index'
import i18n from './plugins/i18n'
import VueDaumPostcode from 'vue-daum-postcode'
import dayjs from 'dayjs'
import './plugins/validate'
import './plugins/agGrid'
import { Form, Field, ErrorMessage } from 'vee-validate'
import '@/assets/css/tailwind.css'
import Toaster from '@meforma/vue-toaster'
import { createHead } from '@vueuse/head'
import { AgGridVue } from 'ag-grid-vue3'

import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

const app = createApp(App)
const head = createHead()
router.beforeEach(to => {
  if (to.path === '/') {
    router.push({ name: 'Pdahome' })
    return
  }
})

// * 유효성검사에 필요한 컴포넌트 글로벌하게 등록
app.component('VeeForm', Form)
app.component('FieldForm', Field)
app.component('ErrorMessage', ErrorMessage)
app.component('AgGridVue', AgGridVue)

app.use(VueDaumPostcode)
app.use(head)
app.use(dayjs)
app.use(store)
app.use(router)
app.use(i18n)
app.use(Toaster, { position: 'top', duration: 500 })
app.mixin(mixins)
app.mount('#app')

Sentry.init({
  app,
  dsn: 'https://d78d0fae46894ea7bd142a53507b58cc@o1104605.ingest.sentry.io/6152187',
  logErrors: true,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: [
        'wms-pda.yesbee.com',
        'gray-mud-019445300.azurestaticapps.net',
        'hive2.azurewebsites.net/v1',
        /^\//,
      ],
    }),
    new Sentry.Integrations.Breadcrumbs({
      console: false,
    }),
  ],
  tracesSampleRate: 0.25,
  // environment: process.env.NODE_ENV,
  denyUrls: 'localhost',
})
try {
  Sentry.setUser({
    email: JSON.parse(localStorage.getItem('username')),
  })
} catch (e) {
  app.$toast.error('다시 로그인해주세요.')
  localStorage.clear()
}
