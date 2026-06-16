import Vue from "vue";
import store from "./store";
import * as WebIM from "./utils/WebIM.js";
import "@/style/element-#EF2E22/index.css";
import ElementUI from "element-ui";
import ElementLocale from "element-ui/lib/locale";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueI18n from "vue-i18n";
// import "element-ui/lib/theme-chalk/index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import App from "./App.vue";
import messages from "./locale/index";
import VueRouter from "vue-router";
import Flutterwave from 'flutterwave-vue-v3';
import "@/style/iconfont.css";
import "@/style/sokogateIconfont.css";
import "@/style/colorful.js";
import "@/style/style.css";
import { routes } from "@/router/router.js";
import * as utils from "@/utils";
Vue.prototype.$utils = utils;
import htmlToPdf from '@/utils/htmlToPdf'
Vue.use(htmlToPdf)

import { VueJsonp } from "vue-jsonp"
Vue.prototype.$jsonp = VueJsonp
Vue.use(VueJsonp)


// 使用 vue-meta
import Meta from "vue-meta";
Vue.use(Meta);

import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import frLocale from "element-ui/lib/locale/lang/fr"
import esLocale from "element-ui/lib/locale/lang/es"
import ptLocale from "element-ui/lib/locale/lang/pt"
import arLocale from "element-ui/lib/locale/lang/ar"
import ruLocale from "element-ui/lib/locale/lang/ru-RU"
import faLocale from "element-ui/lib/locale/lang/fa"
import idLocale from "element-ui/lib/locale/lang/id"
// console.log("messages:", messages);

let i18nConfig = {
  locale: "zh",
  // silentTranslationWarn: true, //去除国际化警告
  messages: {
    zh: {
      ...messages.zh,
      ...zhLocale,
    },
    en: {
      ...messages.en,
      ...enLocale,
    },
    // 法语
    fra: {
      ...messages.fra,
      ...frLocale
    },
    // 西班牙语
    spa: {
      ...messages.spa,
      ...esLocale
    },
    // 葡萄牙语
    pt: {
      ...messages.pt,
      ...ptLocale
    },
    // 阿拉伯语
    ara: {
      ...messages.ara,
      ...arLocale
    },
    // 俄语
    ru: {
      ...messages.ru,
      ...ruLocale
    },
    // 波斯语
    per: {
      ...messages.per,
      ...faLocale
    },
    // 印地语
    hi: {
      ...messages.hi,
      ...idLocale
    }

  },
};

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(BootstrapVue);
Vue.use(VueI18n);
Vue.use(IconsPlugin);

// Vue.use(Flutterwave, { publicKey: 'FLWPUBK-5dc9f9cd81b9281b66830b32c6d79ff0-X' })
// Vue.use(Flutterwave, { publicKey: 'FLWPUBK_TEST-e95910eabc6a967b8d27de49be9c69e5-X' })
// Vue.use(Flutterwave, { publicKey: 'FLWPUBK-5dc9f9cd81b9281b66830b32c6d79ff0-X' })
Vue.use(Flutterwave, { publicKey: 'FLWPUBK-1970364037b09e3a7f047b75911b4e30-X' })

ElementLocale.i18n((key, value) => i18n.t(key, value));

const i18n = new VueI18n(i18nConfig);

const router = new VueRouter({
  mode: "history",
  routes: routes,
  scrollBehavior() {
    // return 期望滚动到哪个的位置
    return {
      // 滚动到顶部
      y: 0,
    };
  },
});

Vue.directive("title", {
  inserted: function (el) {
    // console.log(el, binding);
    document.title = el.dataset.title;
  },
});

window.vm = new Vue({
  el: "#app",
  router,
  WebIM,
  i18n,
  store,
  render: (h) => h(App),
});
