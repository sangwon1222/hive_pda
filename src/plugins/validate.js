/* eslint-disable no-unused-vars */
import { defineRule, configure } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n'
import AllRules from '@vee-validate/rules'
import { required } from '@vee-validate/rules'
// import { codes } from "./lang-codes";
// import { codes } from "../locales/lang-codes";
import ko from '../locales/ko'
import en from '../locales/en'

// configure({
//   validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
//   validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
//   validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
//   validateOnModelUpdate: true,
// });

/**
 * * 2번째 인자함수의 리턴값에 따른 동작
 * ? [true]: 유효성검사 통과
 * ? [string]: 검증실패하고 표시할 오류 메시지가 있는 경우
 * ? [false]: 검증실패시 config.defaultMessage로 오류메시지 표기
 * ? [promise]: 비동기rule인 경우 promise는 string이나 true로 resolve되어야함.
 */
// defineRule("required", (value) => {
//   return true;
// });

// (async () => {
//   const locales = await Promise.all(
//     codes.map((code) => import(`@vee-validate/i18n/dist/locale/${code}.json`))
//   );

//   const dictionary = locales.reduce((dict, curr, idx) => {
//     const code = codes[idx];
//     dict[code] = curr;

//     return dict;
//   }, {});

//   configure({
//     generateMessage: localize(dictionary),
//     validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
//     validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
//     validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
//     validateOnModelUpdate: true,
//   });

//   setLocale("ko");
// })();

Object.keys(AllRules).forEach(rule => {
  defineRule(rule, AllRules[rule])
})
configure({
  generateMessage: localize({
    ko: { messages: ko.validation },
    en: { messages: en.validation },
  }),
  validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: true,
})

setLocale('ko')

// defineRule("required", (value, ctx) => {
//   return true;
// });
