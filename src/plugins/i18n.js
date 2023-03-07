// * vue-i18n/index, https://stackoverflow.com/questions/66140411/you-are-running-the-esm-bundler-build-of-vue-i18n-it-is-recommended-to-configur
import { createI18n } from 'vue-i18n/index'
import ko from '../locales/ko'
import en from '../locales/en'

const messages = {
  ko,
  en,
}

const i18n = createI18n({
  legacy: false,
  locale: 'ko',
  fallbackLocale: 'en',
  globalInjection: true,
  messages,
})

export default i18n
