import Vue from "vue";
import store from "./store";
Vue.prototype.$store = store;
import * as WebIM from "./utils/WebIM.js";
import "@/style/element-#EF2E22/index.css";
import ElementUI from "element-ui";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import BootstrapVue from "bootstrap-vue";
import VueI18n from "vue-i18n";
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

let i18nConfig = {
  locale: "zh",
  // silentTranslationWarn: true, //去除国际化警告
  messages: messages
};

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(BootstrapVue);
Vue.use(VueI18n);

// Vue.use(Flutterwave, { publicKey: 'FLWPUBK-5dc9f9cd81b9281b66830b32c6d79ff0-X' })
// Vue.use(Flutterwave, { publicKey: 'FLWPUBK_TEST-e95910eabc6a967b8d27de49be9c69e5-X' })
// Vue.use(Flutterwave, { publicKey: 'FLWPUBK-5dc9f9cd81b9281b66830b32c6d79ff0-X' })
Vue.use(Flutterwave, { publicKey: 'FLWPUBK-1970364037b09e3a7f047b75911b4e30-X' })

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

if (process.env.NODE_ENV !== 'production') {
  const warn = console.error
  console.error = function (...args) {
    if (typeof args[0] === 'string' && args[0].includes('ResizeObserver loop completed with undelivered notifications')) {
      return
    }
    warn.apply(console, args)
  }
}
