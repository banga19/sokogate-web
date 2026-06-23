import Vue from "vue";
import Vuex from "vuex";
import { mapCategory, normalizeStaticCategory } from "@/utils/category";
import navModules from './nav'
import categoryData from "@/layout/HeaderV2/category.data";

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
      // With HttpOnly cookies, JS can't read the actual cookie expiry.
      // 'token' is a placeholder set by initializeAuth when the /profile
      // call succeeds. Real auth validation happens server-side via the
      // HttpOnly cookie on every request.
      if (state.token) {
        return true;
      }
      return false;
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
        // Token stored in HttpOnly cookie by backend — state tracks user info only
        localStorage.setItem("currentUser", JSON.stringify(user));
        state.user = user;
        state.token = token;
        state.auth_token_expire = expire;
      }
    },
    loginout(state) {
      // Clear client-side state (server-side HttpOnly cookie cleared via /logout endpoint)
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
    /**
     * Initialize auth state by checking the HttpOnly cookie via /profile.
     * Called on app startup — replaces the old localStorage token hydration.
     */
    async initializeAuth({ commit }) {
      try {
        const { default: request } = await import('@/utils/request')
        const res = await request({
          url: 'profile',
          method: 'GET',
          auth: 0,
        })
        if (res.errcode === 0 && res.data) {
          const user = res.data
          // Placeholder token for state tracking (real auth is in HttpOnly cookie).
          // Expire is set generously — the server validates the actual cookie.
          commit('login', {
            user,
            token: 'cookie-auth',
            expire: String(Math.round(Date.now() / 1000) + 86400 * 7), // 7 days — matches refresh token TTL
          })
        }
      } catch (e) {
        // Not logged in — that's fine
        commit('loginout')
      }
    },
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
        commit('setMenu', (res.data.rows || []).map(mapCategory));
      } catch (e) {
        console.error('fetchMenus failed:', e);
        // Fallback to static category data when API is unavailable
        commit('setMenu', normalizeStaticCategory(categoryData).map(mapCategory));
      }
    }
  }
});

export default store;
