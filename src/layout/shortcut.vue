<template>
  <div class="shortcut-wrap">
    <b-container class="shortcut">
      <div class="shortcut-hd">
        <div
          style="
            width: 93%;
            height: 50px;
            background-color: #ebecee;
            position: absolute;
            top: 2%;
            margin: auto;
            z-index: 99;
            border-radius: 10px;
          "
          v-if="isButtonShow"
        >
          <el-button
            type="danger"
            round
            style="
              position: absolute;
              top: 50%;
              right: 20px;
              transform: translateY(-50%);
            "
            @click="toDownLoad"
            v-if="isIosOpened"
            >Open the app</el-button
          >
          <div
            style="
              font-size: 15px;
              color: black;
              width: 120px;
              height: 30px;
              border-radius: 30px;
              position: relative;
              right: 0;
            "
          >
            <a ref="androidLink" :href="appUrl" style="display: none"
              >Open the App</a
            >
          </div>
          <i
            class="el-icon-error"
            style="position: absolute; top: 0; right: 0; font-size: 15px"
            @click="undownLoad"
          ></i>
        </div>
        <el-dropdown
          v-if="currentUser"
          class="shortcut-hd-btn"
          trigger="click"
          @command="userCommand"
        >
          <div>
            <svg class="colorful" aria-hidden="true">
              <use xlink:href="#colorful-Frame-61" />
            </svg>
            {{ currentUser.email || currentUser.mobile }}
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="authentication">
              {{ $t("authentication") }}
            </el-dropdown-item>
            <el-dropdown-item command="verifymailbox">
              {{ $t("bindemail") }}
            </el-dropdown-item>
            <el-dropdown-item command="bindmobilenumber">
              {{ $t("bindmobile") }}
            </el-dropdown-item>
            <el-dropdown-item command="orders">
              {{ $t("layout.orders") }}
            </el-dropdown-item>
            <el-dropdown-item command="wishlist">
              {{ $t("layout.wishlist") }}
            </el-dropdown-item>
            <el-dropdown-item command="my-sokogate">
              {{ $t("layout.my-sokogate") }}
            </el-dropdown-item>
            <el-dropdown-item command="exit">
              {{ $t("login.out") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-else class="shortcut-hd-btn" @click="$router.push('/v2/login')">
          <svg class="colorful" aria-hidden="true">
            <use xlink:href="#colorful-Frame-61" />
          </svg>
          {{ $t("general.registerorsignin") }}
        </div>
        <!-- country -->
        <el-dropdown
          class="shortcut-hd-btn"
          trigger="click"
          @command="countryCommand"
        >
          <span class="span-svg">
            <svg
              t="1676010457745"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4118"
              width="12"
              height="12"
            >
              <path
                d="M512.392533 68.266667C314.760533 68.266667 154.4704 219.648 153.6 408.4736l0.085333 7.850667c1.536 65.160533 22.272 127.0784 59.460267 180.258133l4.010667 5.614933 1.826133 2.952534 1.6896 2.525866c1.143467 1.621333 2.3552 3.157333 3.703467 4.676267l0.3072 0.341333 233.335466 296.021334a68.266667 68.266667 0 0 0 11.349334 11.3664l3.003733 2.218666a68.266667 68.266667 0 0 0 92.859733-13.585066L798.5664 612.693333l-1.6384 1.774934c2.901333-2.9696 5.12-5.905067 7.3216-9.301334l2.1504-3.464533c40.482133-55.0912 63.146667-122.026667 64-192.631467C870.4 220.091733 709.632 68.266667 512.392533 68.266667z m0 68.266666C672.785067 136.533333 802.133333 258.679467 802.133333 408.644267a264.1408 264.1408 0 0 1-51.643733 153.9072l-3.618133 5.632a11.895467 11.895467 0 0 1 1.3824-1.604267l-2.474667 2.798933-234.154667 297.079467-234.154666-297.079467-1.3312-1.570133-2.542934-4.027733 1.9968 3.413333-0.170666-0.170667 0.324266 0.443734C239.616 517.461333 221.866667 464.4352 221.866667 408.644267 222.549333 258.372267 351.573333 136.533333 512.392533 136.533333z"
                fill="#444444"
                p-id="4119"
              ></path>
              <path
                d="M512 261.0176a153.6 153.6 0 1 0 0 307.2 153.6 153.6 0 0 0 0-307.2z m0 68.266667a85.333333 85.333333 0 1 1 0 170.666666 85.333333 85.333333 0 0 1 0-170.666666z"
                fill="#d81e06"
                p-id="4120"
                data-spm-anchor-id="a313x.7781069.0.i12"
                class="selected"
              ></path>
            </svg>
            {{ country }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-input
              v-model="searchCountry"
              @input="countryInput"
              class="country-input"
              size="mini"
              prefix-icon="el-icon-search"
              :placeholder="$t('index.search')"
              clearable
            >
            </el-input>
            <div class="project-dropdown">
              <el-dropdown-item
                :command="item.name"
                v-for="(item, index) in cutCountry"
                :key="index"
              >
                {{ item.name }}
              </el-dropdown-item>
            </div>
            <!-- <el-dropdown-item
              :command="item.name"
              v-for="(item, index) in cutCountry"
              :key="index"
            >
              {{ item.name }}
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
        <!-- guarantee -->
        <div
          class="shortcut-hd-btn"
          @click="$router.push({ name: 'guarantee' })"
        >
          <svg class="colorful" aria-hidden="true">
            <use xlink:href="#colorful-Frame-22" />
          </svg>
          {{ $t("general.guarantee") }}
        </div>
        <!-- payment -->
        <div class="shortcut-hd-btn" @click="$router.push('/v2/payment')">
          <svg class="colorful" aria-hidden="true">
            <use xlink:href="#colorful-Frame-32" />
          </svg>
          {{ $t("general.payment") }}
        </div>
        <!-- delivery -->
        <div
          class="shortcut-hd-btn"
          @click="$router.push({ name: 'delivery' })"
        >
          <svg class="colorful" aria-hidden="true">
            <use xlink:href="#colorful-Frame-4" />
          </svg>
          {{ $t("general.delivery") }}
        </div>
        <div class="shortcut-hd-btn" @click="newPage">
          <!-- <svg class="colorful" aria-hidden="true">
            <use xlink:href="#colorful-Frame-6" />
          </svg> -->
          <i class="sokogate icon-a-Group206 createmyshop"></i>
          <span class="createmyshop">
            {{ $t("general.createmyshop") }}
          </span>
        </div>
      </div>
      <!-- <div class="shortcut-bd">{{ auth_token }}</div> -->
      <div class="shortcut-ft">
        <div class="shortcut-ft-btn" @click="$utils.navto('/v2/order')">
          <i class="sokogate icon-a-Group199" />
        </div>
        <div
          class="shortcut-ft-btn"
          @click="$utils.navto('/v2/collection/collection')"
        >
          <i class="sokogate icon-a-Group200" />
        </div>
        <div class="shortcut-ft-btn" @click="$utils.navto('/v2/shopping-cart')">
          <b-avatar
            :badge="cartCount ? `${cartCount}` : false"
            badge-top
            badge-right
            badge-variant="danger"
          >
            <i class="sokogate icon-a-Group202" />
          </b-avatar>
        </div>

        <el-dropdown
          class="shortcut-ft-btn"
          @command="localeCurrency"
          :hide-on-click="false"
        >
          <span class="sokogate text">{{
            $store.state.currency === "XOF" ? "FCFA" : $store.state.currency
          }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="USD">
              <sui-flag name="United States" />USD
            </el-dropdown-item>
            <el-dropdown-item command="CNY">
              <sui-flag name="China" />CNY
            </el-dropdown-item>
            <el-dropdown-item command="HKD"
              ><sui-flag name="Hong Kong" /> HKD
            </el-dropdown-item>
            <el-dropdown-item command="EUR">
              <sui-flag name="eur" />EUR
            </el-dropdown-item>
            <el-dropdown-item command="GBP">
              <sui-flag name="United Kingdom" />GBP
            </el-dropdown-item>
            <el-dropdown-item command="JPY">
              <sui-flag name="Japan" />JPY
            </el-dropdown-item>
            <el-dropdown-item command="CAD">
              <sui-flag name="Canada" />CAD
            </el-dropdown-item>
            <el-dropdown-item command="KRW">
              <sui-flag name="Korea, Republic of" />KRW
            </el-dropdown-item>
            <el-dropdown-item command="AUD">
              <sui-flag name="Australia" />AUD
            </el-dropdown-item>
            <el-dropdown-item command="more" divided>
              <!-- {{ $t("common.more") }} -->
              <currency-select @select="selectCurrency"></currency-select>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown
          class="shortcut-ft-btn"
          @command="localeChange"
          :hide-on-click="false"
        >
          <i class="sokogate icon-a-Group205" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in dropList"
                :key="index"
                :command="item.value"
                :class="{ selected: status == item.value }"
                ><sui-flag :name="item.name" />{{
                  $t("locale." + item.label)
                }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
          <!-- <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="zh"
            >
              <sui-flag name="China" />
              {{ $t("locale.zh-hans") }}
            </el-dropdown-item>
            <el-dropdown-item command="en" divided>
              <sui-flag name="United States" />
              {{ $t("locale.en") }}
            </el-dropdown-item>
            <el-dropdown-item command="fr" divided>
              <sui-flag name="France" />
              {{ $t("locale.fr") }}
            </el-dropdown-item>
            <el-dropdown-item command="spa" divided>
              <sui-flag name="Spain" />
              {{ $t("locale.es") }}
            </el-dropdown-item>
            <el-dropdown-item command="pt" divided>
              <sui-flag name="Portugal" />
              {{ $t("locale.pt") }}
            </el-dropdown-item>
            <el-dropdown-item command="ara" divided>
              <sui-flag name="United Arab Emirates" />
              {{ $t("locale.ar") }}
            </el-dropdown-item>
            <el-dropdown-item command="ru" divided>
              <sui-flag name="Belarus" />
              {{ $t("locale.ru") }}
            </el-dropdown-item>
            <el-dropdown-item command="per" divided>
              <sui-flag name="Iran, Islamic Republic of" />
              {{ $t("locale.fa") }}
            </el-dropdown-item>
            <el-dropdown-item command="hi" divided>
              <sui-flag name="India" />
              {{ $t("locale.id") }}
            </el-dropdown-item>
          </el-dropdown-menu> -->
        </el-dropdown>

        <a href="tel:+8618813759438" class="shortcut-ft-btn">
          <i class="sokogate icon-a-Group203" />
        </a>
      </div>
    </b-container>

    <el-dialog
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="$t('common.more') + $t('common.currency')"
      :visible.sync="dialogTableVisible"
    >
      <el-row>
        <el-col>
          <el-autocomplete
            class="inline-input"
            v-model="state"
            :fetch-suggestions="querySearch"
            :placeholder="$t('common.selectPlaceholder')"
            autocomplete="autocomplete"
            @select="handleSelect"
            prefix-icon="el-icon-search"
          ></el-autocomplete>
        </el-col>
      </el-row>
      <el-row v-if="isShow">
        <el-col
          v-for="(item, index) in currencyLine"
          :key="`currency_${index}`"
        >
          <h2>{{ item }}</h2>
          <template v-for="(ic, inx) in currencyObj[item]">
            <el-button
              class="currency-btn"
              :key="inx"
              @click="localeCurrency(ic.currency)"
            >
              <sui-flag :name="ic.name" />
              {{ ic.currency }}
            </el-button>
          </template>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col>
          <h2>{{ list.key }}</h2>
          <el-button class="currency-btn" @click="localeCurrency(list.value)">
            <sui-flag :name="list.name" />{{ list.value }}
          </el-button>
        </el-col>
      </el-row>
      <!-- <template v-for="item in sortCurrncy">
        <el-button
          class="currency-btn"
          :key="item.currency"
          @click="localeCurrency(item.currency)"
        >
          <sui-flag :name="item.name" />
          {{ item.currency }}
        </el-button>
      </template> -->
    </el-dialog>

    <el-dialog
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="$t('bindemail')"
      :visible.sync="emailVisible"
    >
      <el-row>
        <el-col> <bind-email @onsuccess="bindEmail" /></el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="$t('bindmobile')"
      :visible.sync="mobileVisible"
    >
      <el-row>
        <el-col>
          <bind-mobile @onsuccess="bindMobile" />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { GetCartList } from "@/utils/api";
import SuiFlag from "@/components/product/Flag";
import BindMobile from "@/components/authentication/BindMobile";
import BindEmail from "@/components/authentication/BindEmail";
import CurrencySelect from "@/components/CurrencySelect";
// import CountrySelect from "@/components/CountrySelect";
import { GeCountryV2List } from "@/utils/api";
import ZhLanguage from "@/locale/zh.json";
export default {
  components: { SuiFlag, BindMobile, BindEmail, CurrencySelect },
  data() {
    return {
      dropList: [
        { value: "zh", label: "zh-hans", name: "China" },
        { value: "en", label: "en", name: "United States" },
        { value: "fra", label: "fr", name: "France" },
        { value: "spa", label: "es", name: "Spain" },
        { value: "pt", label: "pt", name: "Portugal" },
        { value: "ara", label: "ar", name: "United Arab Emirates" },
        { value: "ru", label: "ru", name: "Belarus" },
        { value: "per", label: "fa", name: "Iran, Islamic Republic of" },
        { value: "hi", label: "id", name: "India" },
      ],
      restaurants: [],
      jsonData: ZhLanguage,
      state: "",
      isShow: true,
      currencyObj: {},
      list: {},
      timeout: null,
      gridData: [
        {
          currency: "USD",
          name: "United States",
        },
        {
          currency: "CNY",
          name: "China",
        },
        {
          currency: "HKD",
          name: "Hong Kong",
        },
        {
          currency: "EUR",
          name: "eur",
        },
        {
          currency: "GBP",
          name: "United Kingdom",
        },
        {
          currency: "JPY",
          name: "Japan",
        },
        {
          currency: "CAD",
          name: "Canada",
        },
        {
          currency: "KRW",
          name: "Korea, Republic of",
        },
        {
          currency: "AUD",
          name: "Australia",
        },
        {
          currency: "ARS",
          name: "Argentina",
        },
        {
          currency: "BRL",
          name: "Brazil",
        },
        {
          currency: "CVE",
          name: "Cape Verde",
        },
        {
          currency: "RMB",
          name: "China",
        },
        {
          currency: "CLP",
          name: "Chile",
        },
        {
          currency: "COP",
          name: "Colombia",
        },
        {
          currency: "CDF",
          name: "Congo",
        },
        {
          currency: "EGP",
          name: "Egypt",
        },
        {
          currency: "ETB",
          name: "Ethiopia",
        },
        {
          currency: "GMD",
          name: "Gambia",
        },
        {
          currency: "GHS",
          name: "Ghana",
        },
        {
          currency: "GNF",
          name: "Guinea",
        },
        {
          currency: "KES",
          name: "Kenya",
        },
        {
          currency: "LRD",
          name: "Liberia",
        },
        {
          currency: "MWK",
          name: "Malawi",
        },
        {
          currency: "MXN",
          name: "Mexico",
        },
        {
          currency: "MAD",
          name: "Morocco",
        },
        {
          currency: "MZN",
          name: "Mozambique",
        },
        {
          currency: "MUR",
          name: "Mauritius",
        },
        {
          currency: "NGN",
          name: "Nigeria",
        },
        {
          currency: "RWF",
          name: "Rwanda",
        },
        {
          currency: "SLL",
          name: "Sierra Leone",
        },
        {
          currency: "STD",
          name: "Sao Tome and Principe",
        },
        {
          currency: "ILS",
          name: "Israel",
        },
        {
          currency: "TRY",
          name: "Turkey",
        },
        {
          currency: "ZAR",
          name: "South Africa",
        },
        {
          currency: "TZS",
          name: "Tanzania, United Republic of",
        },
        {
          currency: "UGX",
          name: "Uganda",
        },
        {
          currency: "XAF",
          name: "Central African Republic",
        },
        {
          currency: "XOF",
          name: "France",
        },
        {
          currency: "FCFA",
          name: "France",
        },
        {
          currency: "ZMK",
          name: "Zambia",
        },
        {
          currency: "ZMW",
          name: "Zimbabwe",
        },
      ],
      allCountry: [],
      countryList: [],
      cutCountry: [], // 搜索出的国家列表
      searchCountry: null,
      country: null,
      appUrl: "",
      deviceType: "",
      isButtonShow: false,
      isIosOpened: false,
      browser: {
        versions: (() => {
          const u = navigator.userAgent;
          return {
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
            weixin: u.toLowerCase().indexOf("micromessenger") > -1,
          };
        })(),
      },
    };
  },
  created() {
    this.initLocalStorage();
    this.restaurants = this.loadAll();
    this.SortbyCurrency();
    this.gpsCountry();
    this.initCountry();
  },
  watch: {
    state: function (newVal, oldVal) {
      console.log(newVal, "newVal", oldVal, "oldVal");
      if (newVal === "") {
        this.isShow = true;
      }
    },
  },
  computed: {
    status: {
      get() {
        return this.$store.state.language;
      },
      set(v) {
        // console.log(v);
        this.$store.commit("setLanguage", v);
      },
    },
    locale() {
      return this.$i18n.locale;
    },
    currencyLine() {
      return Object.keys(this.currencyObj);
    },
    sortCurrncy() {
      return this.SortbyKey(this.gridData, "currency");
    },
    dialogTableVisible: {
      get() {
        return this.$store.state.currencyDialogVisible;
      },
      set(val) {
        this.$store.commit("setCurrencyDialogVisible", val);
      },
    },
    mobileVisible: {
      get() {
        return this.$store.state.mobileVisible;
      },
      set(val) {
        this.$store.commit("setmobileVisible", val);
      },
    },
    emailVisible: {
      get() {
        return this.$store.state.emailVisible;
      },
      set(val) {
        this.$store.commit("setemailVisible", val);
      },
    },
    currentUser() {
      // console.log("currentUser:", this.$store.state);
      return this.$store.state.user;
    },
    cartCount() {
      // console.log("cartCount:", this.$store.state);
      return this.$store.state.cartCount;
    },
  },
  mounted() {
    this.getDeviceType();
  },
  methods: {
    undownLoad() {
      this.isButtonShow = false;
    },
    toDownLoad() {
      const deviceType = this.getDeviceType();
      let appUrl, storeUrl;

      if (deviceType === "ios") {
        appUrl = "sokogate://";
        storeUrl = "itms-apps://apps.apple.com/us/app/sokogate/id6480171536";
        this.appUrl = appUrl;
        this.tryOpenApp(appUrl, storeUrl);
      } else if (deviceType === "android") {
        appUrl =
          "sokogate://sokogate#Intent;scheme=sokogate;package=com.example.sokogate;end";
        storeUrl = "market://details?id=com.example.sokogate";
        this.appUrl = appUrl;

        this.$nextTick(() => {
          this.$refs.androidLink?.click();
          setTimeout(() => {
            window.location.href = storeUrl;
          }, 2000);
        });
      } else {
        // 其他跳官网
        window.location.href = "https://www.sokogate.com";
      }
    },

    tryOpenApp(appUrl, storeUrl) {
      const timeout = 2000;
      let isAppOpened = false;

      window.addEventListener("pagehide", () => {
        isAppOpened = true;
      });

      window.location.href = appUrl;

      setTimeout(() => {
        if (!isAppOpened) {
          window.location.href = storeUrl;
        }
      }, timeout);
    },

    getDeviceType() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipod|android.*mobile|windows.*phone/i.test(
        userAgent
      );
      const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
      this.isButtonShow = isMobile || isTablet;
      if (this.isButtonShow) {
        this.isIosOpened = true;
      }
      if (userAgent.includes("android")) {
        return "android";
      } else if (
        userAgent.includes("iphone") ||
        userAgent.includes("ipad") ||
        userAgent.includes("ipod")
      ) {
        return "ios";
      } else {
        return "other";
      }
    },
    // 选择货币
    selectCurrency(e) {
      console.log("selectCurrency", e);
      if (e === "FCFA") {
        this.$store.commit("setCurrency", "XOF");
      } else {
        this.$store.commit("setCurrency", e);
      }
    },
    // 国家搜索
    countryInput(e) {
      var reg = new RegExp(e, "gi"); // 搜索值
      if (this.$i18n.locale === "zh") {
        //中文搜索
        let commandList = this.countryList.filter((k) => k.name.match(reg));
        this.cutCountry = commandList;
        // console.log(e, commandList);
      } else {
        let commandList = this.countryList.filter((k) => k.nameEn.match(reg));
        this.cutCountry = commandList;
      }
      // let commandList = this.countryList.filter((k) => k.name.indexOf(e) != -1);
      // console.log(e, commandList);
      // this.cutCountry = commandList;
      // console.log(e);
    },
    bindEmail() {
      this.$store.commit("setemailVisible", false);
    },
    bindMobile() {
      this.$store.commit("setmobileVisible", false);
    },
    getListKey() {
      let str = [];
      for (let i = 65; i < 91; i++) {
        str.push(String.fromCharCode(i));
      }
      return str;
    },
    SortbyCurrency() {
      let _A_Z_List = this.getListKey();
      let _currency = this.gridData.map((item) => {
        item["_key"] = item.currency.slice(0, 1).toLocaleUpperCase();
        return item;
      });
      // console.log(_currency);
      for (var i = 0; i < _A_Z_List.length; i++) {
        this.currencyObj[_A_Z_List[i]] = [];
        for (let j = 0; j < _currency.length; j++) {
          if (_currency[j]._key === _A_Z_List[i]) {
            this.currencyObj[_A_Z_List[i]].push(_currency[j]);
          }
        }
        if (!this.currencyObj[_A_Z_List[i]].length) {
          delete this.currencyObj[_A_Z_List[i]];
        }
      }
      // console.log(
      //   this.currencyObj,
      //   Object.keys(this.currencyObj),
      //   " currencyObj"
      // );
    },
    handleSelect(item) {
      console.log(item, this.state);
      if (item) {
        this.list = item;
        this.isShow = false;
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      // console.log(restaurants, "restaurants");
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      // console.log(results, "results");
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return [
        {
          value: "USD",
          name: "United States",
          key: "U",
        },
        {
          value: "CNY",
          name: "China",
          key: "C",
        },
        {
          value: "HKD",
          name: "Hong Kong",
          key: "H",
        },
        {
          value: "EUR",
          name: "eur",
          key: "E",
        },
        {
          value: "GBP",
          name: "United Kingdom",
          key: "G",
        },
        {
          value: "JPY",
          name: "Japan",
          key: "J",
        },
        {
          value: "CAD",
          name: "Canada",
          key: "C",
        },
        {
          value: "KRW",
          name: "Korea, Republic of",
          key: "K",
        },
        {
          value: "AUD",
          name: "Australia",
          key: "A",
        },
        {
          value: "ARS",
          name: "Argentina",
          key: "A",
        },
        {
          value: "BRL",
          name: "Brazil",
          key: "B",
        },
        {
          value: "CVE",
          name: "Cape Verde",
          key: "C",
        },
        {
          value: "RMB",
          name: "China",
          key: "R",
        },
        {
          value: "CLP",
          name: "Chile",
          key: "C",
        },
        {
          value: "COP",
          name: "Colombia",
          key: "C",
        },
        {
          value: "CDF",
          name: "Congo",
          key: "C",
        },
        {
          value: "EGP",
          name: "Egypt",
          key: "E",
        },
        {
          value: "ETB",
          name: "Ethiopia",
          key: "E",
        },
        {
          value: "GMD",
          name: "Gambia",
          key: "G",
        },
        {
          value: "GHS",
          name: "Ghana",
          key: "G",
        },
        {
          value: "GNF",
          name: "Guinea",
          key: "G",
        },
        {
          value: "KES",
          name: "Kenya",
          key: "K",
        },
        {
          value: "LRD",
          name: "Liberia",
          key: "L",
        },
        {
          value: "MWK",
          name: "Malawi",
          key: "M",
        },
        {
          value: "MXN",
          name: "Mexico",
          key: "M",
        },
        {
          value: "MAD",
          name: "Morocco",
          key: "M",
        },
        {
          value: "MZN",
          name: "Mozambique",
          key: "M",
        },
        {
          value: "MUR",
          name: "Mauritius",
          key: "M",
        },
        {
          value: "NGN",
          name: "Nigeria",
          key: "N",
        },
        {
          value: "RWF",
          name: "Rwanda",
          key: "R",
        },
        {
          value: "SLL",
          name: "Sierra Leone",
          key: "S",
        },
        {
          value: "STD",
          name: "Sao Tome and Principe",
          key: "S",
        },
        {
          value: "ILS",
          name: "Israel",
          key: "I",
        },
        {
          value: "TRY",
          name: "Turkey",
          key: "T",
        },
        {
          value: "ZAR",
          name: "South Africa",
          key: "Z",
        },
        {
          value: "TZS",
          name: "Tanzania, United Republic of",
          key: "T",
        },
        {
          value: "UGX",
          name: "Uganda",
          key: "U",
        },
        {
          value: "XAF",
          name: "Central African Republic",
          key: "X",
        },
        {
          value: "XOF",
          name: "Benin",
          key: "X",
        },
        {
          value: "ZMK",
          name: "Zambia",
          key: "Z",
        },
        {
          value: "ZMW",
          name: "Zimbabwe",
          key: "Z",
        },
      ];
    },
    SortbyKey(array, Key) {
      return array.sort(function (a, b) {
        var x = a[Key];
        var y = b[Key];
        return x < y ? -1 : x < y ? 1 : 0;
      });
    },
    newPage() {
      window.open("https://vendor.sokogate.com/v2/register");
    },
    initLocalStorage() {
      const token = localStorage.getItem("auth_token");
      const currentUser = localStorage.getItem("currentUser");
      const auth_token_expire = localStorage.getItem("auth_token_expire");
      const user = currentUser ? JSON.parse(currentUser) : null;
      // console.log("token:", token);
      // console.log("user:", user);
      // console.log("auth_token_expire:", auth_token_expire);

      const currency = localStorage.getItem("currency");

      if (currency) {
        this.$store.commit("setCurrency", currency);
      }

      const language = localStorage.getItem("language");

      if (language) {
        this.$store.commit("setLanguage", language);
      }
      if (
        user &&
        user.userId &&
        token &&
        auth_token_expire &&
        auth_token_expire !== "undefined" &&
        auth_token_expire !== "0"
      ) {
        this.$store.commit("login", { user, token, expire: auth_token_expire });
        this.$nextTick(this.getList());
      } else {
        // console.log('this.$store.commit("loginout");');
        this.$store.commit("loginout");
      }
    },
    getList() {
      // console.log(
      //   "this.$store.getters.authTokenIsValid:",
      //   this.$store.getters.authTokenIsValid
      // );
      if (
        this.$store.getters.authTokenIsValid &&
        !this.$store.state.cartActivated
      ) {
        GetCartList({})
          .then((res) => {
            // console.log(res);
            // this.list = res.data.rows;
            // this.cartCount = res.data.rows.length;
            this.$store.commit("cartCountSet", res.data.rows.length);
          })
          .catch(() => {
            this.$store.commit("cartCountSet", 0);
            // console.log(err);
          });
      }
    },

    localeChange(setlanguage) {
      // console.log("navigator.language:", navigator.language);
      var language = setlanguage;
      this.$store.commit("setLanguage", language);
      const countryEn = localStorage.getItem("country_en");
      // localStorage.setItem("setlanguage", setlanguage);
      if (
        setlanguage == "en" ||
        setlanguage == "zh" ||
        setlanguage == "fra" ||
        setlanguage == "spa" ||
        setlanguage == "pt" ||
        setlanguage == "ara" ||
        setlanguage == "ru" ||
        setlanguage == "per" ||
        setlanguage == "hi"
      ) {
        this.$i18n.locale = setlanguage;
        this.country = this.$t("categorys." + countryEn);
      } else {
        switch (navigator.language) {
          case "en":
            this.$i18n.locale = "en";
            break;
          // 法语
          case "fra":
            this.$i18n.locale = "fra";
            break;
          // 西班牙语
          case "spa":
            this.$i18n.locale = "spa";
            break;
          // 葡萄牙语
          case "pt":
            this.$i18n.locale = "pt";
            break;
          // 阿拉伯语
          case "ara":
            this.$i18n.locale = "ara";
            break;
          // 俄语
          case "ru":
            this.$i18n.locale = "ru";
            break;
          // 伊朗（波斯语）
          case "per":
            this.$i18n.locale = "per";
            break;
          // 印度（印地语）
          case "hi":
            this.$i18n.locale = "hi";
            break;
          case "zh":
          case "zh-CN":
          case "zh-TW":
          case "zh-HK":
            this.$i18n.locale = "zh";
            break;
        }
      }

      let allCountry = this.allCountry;
      if (setlanguage == "zh") {
        let country = allCountry.map((item) => {
          // console.log(item, 'item');
          return {
            nameEn: item.nameEn,
            name: item.name.cn,
            currency: item.currency,
            id: item.id,
          };
        });
        this.countryList = country;
        this.cutCountry = country;
      } else if (
        setlanguage == "en" ||
        setlanguage == "ara" ||
        setlanguage == "ru" ||
        setlanguage == "hi"
      ) {
        let country = allCountry.map((item) => {
          // console.log(item, 'item');
          return {
            nameEn: item.nameEn,
            name: item.nameEn,
            currency: item.currency,
            id: item.id,
          };
        });
        this.countryList = country;
        this.cutCountry = country;
      } else if (setlanguage == "fra") {
        let country = allCountry.map((item) => {
          // console.log(item, 'item');
          return {
            nameEn: item.nameEn,
            name: item.name.fr,
            currency: item.currency,
            id: item.id,
          };
        });
        this.countryList = country;
        this.cutCountry = country;
      } else if (setlanguage == "spa") {
        let country = allCountry.map((item) => {
          // console.log(item, 'item');
          return {
            nameEn: item.nameEn,
            name: item.name.es,
            currency: item.currency,
            id: item.id,
          };
        });
        this.countryList = country;
        this.cutCountry = country;
      } else if (setlanguage == "pt") {
        let country = allCountry.map((item) => {
          // console.log(item, 'item');
          return {
            nameEn: item.nameEn,
            name: item.name.pt,
            currency: item.currency,
            id: item.id,
          };
        });
        this.countryList = country;
        this.cutCountry = country;
      } else if (setlanguage == "per") {
        let country = allCountry.map((item) => {
          // console.log(item, 'item');
          return {
            nameEn: item.nameEn,
            name: item.name.fa,
            currency: item.currency,
            id: item.id,
          };
        });
        this.countryList = country;
        this.cutCountry = country;
      }
    },

    localeCurrency(currency) {
      console.log("localeCurrency:", currency);
      if (currency === "more") {
        this.$store.commit("setCurrencyDialogVisible", true);
      } else if (currency === "FCFA") {
        // console.log("FCFA");
        this.$store.commit("setCurrency", "XOF");
        this.$store.commit("setCurrencyDialogVisible", false);
      } else {
        this.$store.commit("setCurrency", currency);
        this.$store.commit("setCurrencyDialogVisible", false);
      }
    },

    loginoutConfirm() {
      // console.log("loginout:");
      this.$bvModal
        .msgBoxConfirm(this.$t("login.out-confirm"), {
          title: this.$t("api.message"),
          okTitle: this.$t("modal.ok"),
          cancelTitle: this.$t("modal.cancel"),
        })
        .then((value) => {
          // console.log("msgBoxConfirm:", value);
          if (value) {
            this.handleLoginout();
          }
        })
        .catch((err) => {
          console.log("catch-err:", err);
          // An error occurred
        });
    },

    handleLoginout() {
      this.$store.commit("loginout");
      this.$router.go(0);
    },

    userCommand(command) {
      if (command === "exit") {
        this.loginoutConfirm();
      } else if (command === "authentication") {
        this.$router.push("/v2/authentication/mobileAuthentication");
      } else if (command === "verifymailbox") {
        this.$store.commit("setemailVisible", true);
      } else if (command === "bindmobilenumber") {
        this.$store.commit("setmobileVisible", true);
      } else if (command === "orders") {
        this.$router.push("/v2/order");
      } else if (command === "wishlist") {
        this.$router.push("/v2/collection/collection");
      } else if (command === "my-sokogate") {
        this.$router.push({ name: "Personal Center" });
      }
    },
    countryCommand(command) {
      console.log("国家", command);
      const result = this.countryList.find((r) => r.name == command);
      console.log("result", result);
      //{name: 'China', currency: CNY}
      if (
        result.nameEn === "China" ||
        result.nameEn === "Hong Kong S.A.R." ||
        result.nameEn === "Macau S.A.R." ||
        result.nameEn === "ChinaTaiwan"
      ) {
        // this.localeChange("zh");
        // console.log(result, this.allCountry);
        this.countryList = this.allCountry.map((item) => {
          return {
            nameEn: item.nameEn,
            name: item.name.cn,
            currency: item.currency,
            id: item.id,
          };
        });
        let commandList = this.countryList.find((k) => k.id == result.id);
        // console.log(commandList);
        this.country = commandList.name;
        this.$store.commit("setLanguage", "zh");
        this.$i18n.locale = "zh";
      } else if (result.nameEn === "France" || result.nameEn === "Canada") {
        this.countryList = this.allCountry.map((item) => {
          return {
            nameEn: item.nameEn,
            name: item.name.fr,
            currency: item.currency,
            id: item.id,
          };
        });
        let commandList = this.countryList.find((k) => k.id == result.id);
        // console.log(commandList);
        this.country = commandList.name;
        this.$store.commit("setLanguage", "fra");
        this.$i18n.locale = "fra";
      } else if (
        result.nameEn === "Mexico" ||
        result.nameEn === "Colombia" ||
        result.nameEn === "Spain" ||
        result.nameEn === "Equatorial Guinea"
      ) {
        this.countryList = this.allCountry.map((item) => {
          return {
            nameEn: item.nameEn,
            name: item.name.es,
            currency: item.currency,
            id: item.id,
          };
        });
        let commandList = this.countryList.find((k) => k.id == result.id);
        // console.log(commandList);
        this.country = commandList.name;
        this.$store.commit("setLanguage", "spa");
        this.$i18n.locale = "spa";
      } else if (
        result.nameEn === "Portugal" ||
        result.nameEn === "Brazil" ||
        result.nameEn === "Angola" ||
        result.nameEn === "Mozambique"
      ) {
        this.countryList = this.allCountry.map((item) => {
          return {
            nameEn: item.nameEn,
            name: item.name.pt,
            currency: item.currency,
            id: item.id,
          };
        });
        let commandList = this.countryList.find((k) => k.id == result.id);
        // console.log(commandList);
        this.country = commandList.name;
        this.$store.commit("setLanguage", "pt");
        this.$i18n.locale = "pt";
      } else if (
        result.nameEn === "Saudi Arabia" ||
        result.nameEn === "Egypt" ||
        result.nameEn === "Libya" ||
        result.nameEn === "Sudan"
      ) {
        this.countryList = this.allCountry.map((item) => {
          return {
            nameEn: item.nameEn,
            name: item.nameEn,
            currency: item.currency,
            id: item.id,
          };
        });
        let commandList = this.countryList.find((k) => k.id == result.id);
        // console.log(commandList);
        this.country = commandList.name;
        this.$store.commit("setLanguage", "ara");
        this.$i18n.locale = "ara";
      } else if (
        result.nameEn === "Russia" ||
        result.nameEn === "Belarus" ||
        result.nameEn === "Ukraine" ||
        result.nameEn === "Kazakhstan"
      ) {
        this.countryList = this.allCountry.map((item) => {
          return {
            nameEn: item.nameEn,
            name: item.nameEn,
            currency: item.currency,
            id: item.id,
          };
        });
        let commandList = this.countryList.find((k) => k.id == result.id);
        // console.log(commandList);
        this.country = commandList.name;
        this.$store.commit("setLanguage", "ru");
        this.$i18n.locale = "ru";
      } else if (
        result.nameEn === "Iran" ||
        result.nameEn === "Tajikistan" ||
        result.nameEn === "Afghanistan"
      ) {
        this.countryList = this.allCountry.map((item) => {
          return {
            nameEn: item.nameEn,
            name: item.name.fa,
            currency: item.currency,
            id: item.id,
          };
        });
        let commandList = this.countryList.find((k) => k.id == result.id);
        // console.log(commandList);
        this.country = commandList.name;
        this.$store.commit("setLanguage", "per");
        this.$i18n.locale = "per";
      } else if (result.nameEn === "India" || result.nameEn === "Mauritius") {
        this.countryList = this.allCountry.map((item) => {
          return {
            nameEn: item.nameEn,
            name: item.nameEn,
            currency: item.currency,
            id: item.id,
          };
        });
        let commandList = this.countryList.find((k) => k.id == result.id);
        // console.log(commandList);
        this.country = commandList.name;
        this.$store.commit("setLanguage", "hi");
        this.$i18n.locale = "hi";
      } else {
        this.countryList = this.allCountry.map((item) => {
          return {
            nameEn: item.nameEn,
            name: item.nameEn,
            currency: item.currency,
            id: item.id,
          };
        });
        let commandList = this.countryList.find((k) => k.id == result.id);
        console.log(commandList);
        this.country = commandList.name;
        this.$store.commit("setLanguage", "en");
        this.$i18n.locale = "en";
      }
      this.countryInput("");
      this.searchCountry = "";
      let countryIpList = [];
      countryIpList.push(result);
      // console.log(countryIpList, 'countryIpListcountryIpListcountryIpList');
      localStorage.setItem("countryIpList", JSON.stringify(countryIpList));
      this.$store.commit("setCurrency", result.currency);
      localStorage.setItem("country_en", result.nameEn);
    },
    // 初始化定位国家
    gpsCountry() {
      let that = this;
      var data = {
        key: "RWMBZ-AZHLJ-GIUFW-KLDDX-PC6IO-U7FIG", //密钥
      };
      var url = "https://apis.map.qq.com/ws/location/v1/ip"; //腾讯地理位置信息接口
      data.output = "jsonp"; // 解决跨域问题
      that
        .$jsonp(url, data)
        .then((res) => {
          // console.log("ip所属国家", res.result.ad_info.nation);
          // console.log(this.jsonData.categorys); // 获取所有国家的中文
          // 根据中文筛出对应值的键
          // console.log(that.getObjectKey(this.jsonData.categorys, res.result.ad_info.nation));
          let countryEn = that.getObjectKey(
            this.jsonData.categorys,
            res.result.ad_info.nation
          );
          localStorage.setItem("country_en", countryEn);
          // console.log(that.$t('categorys.' + test));
          that.country = that.$t("categorys." + countryEn);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取国家列表
    initCountry() {
      this.loading = true;
      let country_en = localStorage.getItem("country_en");
      GeCountryV2List()
        .then((res) => {
          const allCountry = res.data.rows.map((v) => {
            return {
              nameEn: v.name,
              name: JSON.parse(v.translations),
              currency: v.currency,
              id: v.id,
            };
          });
          this.allCountry = allCountry;
          let countryIpList = allCountry.filter((item) => {
            return item.nameEn === country_en;
          });
          // console.log(countryIpList, 'countryIpListcountryIpListcountryIpList');
          localStorage.setItem("countryIpList", JSON.stringify(countryIpList));
          // console.log(allCountry);
          if (this.$i18n.locale == "zh") {
            let country = allCountry.map((item) => {
              // console.log(item, 'item');
              return {
                nameEn: item.nameEn,
                name: item.name.cn,
                currency: item.currency,
                id: item.id,
              };
            });
            this.cutCountry = country;
            this.countryList = country;
          } else if (this.$i18n.locale == "en") {
            let country = allCountry.map((item) => {
              // console.log(item, 'item');
              return {
                nameEn: item.nameEn,
                name: item.nameEn,
                currency: item.currency,
                id: item.id,
              };
            });
            this.cutCountry = country;
            this.countryList = country;
          } else if (this.$i18n.locale == "fra") {
            let country = allCountry.map((item) => {
              // console.log(item, 'item');
              return {
                nameEn: item.nameEn,
                name: item.name.fr,
                currency: item.currency,
                id: item.id,
              };
            });
            this.cutCountry = country;
            this.countryList = country;
          } else if (this.$i18n.locale == "spa") {
            let country = allCountry.map((item) => {
              // console.log(item, 'item');
              return {
                nameEn: item.nameEn,
                name: item.name.es,
                currency: item.currency,
                id: item.id,
              };
            });
            this.cutCountry = country;
            this.countryList = country;
          } else if (this.$i18n.locale == "pt") {
            let country = allCountry.map((item) => {
              // console.log(item, 'item');
              return {
                nameEn: item.nameEn,
                name: item.name.pt,
                currency: item.currency,
                id: item.id,
              };
            });
            this.cutCountry = country;
            this.countryList = country;
          } else if (this.$i18n.locale == "ara") {
            let country = allCountry.map((item) => {
              // console.log(item, 'item');
              return {
                nameEn: item.nameEn,
                name: item.nameEn,
                currency: item.currency,
                id: item.id,
              };
            });
            this.cutCountry = country;
            this.countryList = country;
          } else if (this.$i18n.locale == "ru") {
            let country = allCountry.map((item) => {
              // console.log(item, 'item');
              return {
                nameEn: item.nameEn,
                name: item.nameEn,
                currency: item.currency,
                id: item.id,
              };
            });
            this.cutCountry = country;
            this.countryList = country;
          } else if (this.$i18n.locale == "per") {
            let country = allCountry.map((item) => {
              // console.log(item, 'item');
              return {
                nameEn: item.nameEn,
                name: item.name.fa,
                currency: item.currency,
                id: item.id,
              };
            });
            this.cutCountry = country;
            this.countryList = country;
          } else if (this.$i18n.locale == "hi") {
            let country = allCountry.map((item) => {
              // console.log(item, 'item');
              return {
                nameEn: item.nameEn,
                name: item.nameEn,
                currency: item.currency,
                id: item.id,
              };
            });
            this.cutCountry = country;
            this.countryList = country;
          }
        })
        .catch((err) => {
          console.log("GetCountryList-err:", err);
          this.loading = false;
          this.error = true;
        });
    },
    // 根据键值筛选键
    getObjectKey(object, value) {
      return Object.keys(object).find((key) => object[key] == value);
    },
  },
};
</script>
<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.shortcut {
  &-wrap {
    border-bottom: 0.8px solid #dadada;
    position: sticky;
    top: 0;
    z-index: 99;
    background-color: #fff;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  min-height: 60px;
  @include mobile {
    justify-content: center;
    padding-inline: 15px;
  }

  &-hd {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding: 10px 0;
    @include mobile {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding-bottom: 0;
    }

    &-btn {
      color: #333;
      margin-right: 20px;
      cursor: pointer;
      @include mobile {
        margin-bottom: 10px;
      }
      .createmyshop {
        color: #ef2e22;
      }

      &:hover {
        color: #f84949;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &-bd {
    flex-grow: 1;
  }

  &-ft {
    display: inline-flex;
    padding: 10px 0;

    &-btn {
      width: 38px;
      height: 38px;
      background-color: #fff;
      box-shadow: 0 1px 4px rgba($color: #000000, $alpha: 0.15);
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s all;
      cursor: pointer;
      margin-right: 20px;

      .sokogate {
        font-size: 18px;
        padding: 10px;
        color: #000;
      }

      .badge-secondary {
        background-color: transparent;
      }

      &:hover {
        .sokogate {
          color: #fff;
        }
        background-color: #f84949;
      }

      &:last-child {
        margin-right: 0;
      }

      .text {
        font-size: 12px;
      }
    }
  }
}
.selected {
  background: #ffeeee;
}
.inline-input {
  margin-bottom: 10px;
}
.currency-btn {
  margin-bottom: 10px;
}

.country-input {
  padding-bottom: 5px;
}

.project-dropdown {
  //设置高度才能显示出滚动条 !important
  height: 300px;
  overflow: scroll;
}

.project-dropdown::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: #f5f5f5;
}
.project-dropdown::-webkit-scrollbar-track {
  //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.span-svg {
  // width: 38px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>