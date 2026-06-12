import Vue from "vue";
import Vuex from "vuex";
import navModules from './nav'
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    nav: navModules,
  },
  state: {
    token: null,
    user: null,
    auth_token_expire: 0,
    cartCount: 0,
    cartActivated: false,
    menu: [],
    currencyDialogVisible: false,
    currency: "USD",
    language: "en",
    exchateRateMap: {},
    exchateRateMapExpireAt: 0,
    exchateRateMapLoading: false,
    countryName: "US",
    selectCountry: "",
    amount: 0,
    currentCountry: 0,
    mobileVisible: false,
    emailVisible: false,
    phoneoremail:0,
    onboardingData: null
  },
  getters: {
    authTokenIsValid(state) {
      if (state.token && state.auth_token_expire) {
        const nowUnix = Math.round(new Date().getTime() / 1000);
        if (state.auth_token_expire - nowUnix > 60 * 5) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  mutations: {
    cartCountSet(state, count) {
      state.cartCount = count;
      state.cartActivated = true;
    },
    cartCountPlus(state, plus) {
      state.cartCount = state.cartCount + plus;
    },
    cartCountMinus(state, minus) {
      state.cartCount = state.cartCount - minus;
    },
    login(state, data) {
      const { user, token, expire } = data;
      if (user && token && expire && expire !== "undefined" && expire !== "0") {
        localStorage.setItem("auth_token_expire", expire);
        localStorage.setItem("auth_token", token);
        localStorage.setItem("currentUser", JSON.stringify(user));
        state.user = user;
        state.token = token;
        state.auth_token_expire = expire;
      }
    },
    loginout(state) {
      localStorage.removeItem("auth_token_expire");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("currentUser");
      state.auth_token_expire = 0;
      state.user = null;
      state.token = null;
    },
    setMenu(state, list) {
      state.menu = list;
    },
    setCurrency(state, currency) {
      localStorage.setItem("currency", currency);
      state.currency = currency;
    },
    setLanguage(state, language) {
      localStorage.setItem("language", language);
      state.language = language;
      window.vm.$i18n.locale = language
    },
    setCurrencyDialogVisible(state, visible) {
      state.currencyDialogVisible = visible;
    },
    setExchateRateMap(state, data) {
      state.exchateRateMap = data;
    },
    setExchateRateMapExpireAt(state, unix) {
      state.exchateRateMapExpireAt = unix;
    },
    setExchateRateMapLoading(state, loading) {
      state.exchateRateMapLoading = loading;
    },
    setcountryName(state, countryName) {
      localStorage.setItem("countryName", countryName);
      state.countryName = countryName
    },
    setselectCountry(state, selectCountry) {
      localStorage.setItem("selectCountry", selectCountry)
      state.selectCountry = selectCountry
    },
    setamount(state, amount) {
      state.amount = amount
    },
    setcurrentCountry(state, currentCountry) {
      localStorage.setItem("currentCountry", currentCountry)
      state.currentCountry = currentCountry
    },
    setmobileVisible(state, mobileVisible) {
      state.mobileVisible = mobileVisible
    },
    setemailVisible(state, emailVisible) {
      state.emailVisible = emailVisible
    },
    setphoneoremail(state, phoneoremail) {
      state.phoneoremail = phoneoremail
    },
    setOnboardingData(state, payload) {
      state.onboardingData = payload
      try {
        localStorage.setItem('onboardingData', JSON.stringify(payload))
      } catch (e) {}
    }
  },
  actions: {
    async submitOnboarding({ commit }, payload) {
      const { OnboardingSubmit } = await import('@/utils/api')
      const res = await OnboardingSubmit(payload)
      commit('setOnboardingData', { ...payload, profileComplete: true })
      return res
    },
    async fetchMenus({ commit }) {
      try {
        const { GetCategoryLists } = await import('@/utils/api')
        const res = await GetCategoryLists();
        commit('setMenu', res.data.rows);
      } catch (e) {
        console.error('fetchMenus failed:', e);
      }
    }
  }
});

export default store;
