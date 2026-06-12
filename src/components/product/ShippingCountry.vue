<template>
  <div class="shipping-country">
    <el-dropdown
      class="shortcut-ft-btn"
      :hide-on-click="false"
      @command="localeCountryName"
    >
      <span class="shipping-text">
        {{ $t("common.from") }}<sui-flag />{{
          $t("common.guangzhou,china") + "➔"
        }}
        <sui-flag :name="countryMap[$store.state.countryName]" />
        <!-- {{
          $t("categorys." + countryName)
        }} -->
        {{ $t("categorys." + countryMap[$store.state.countryName]) }}
        <b :style="{ color: '#ef2e22' }">
          {{ $t("shipping.changedestination") }}
        </b>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="US">
          <sui-flag name="United States" />{{ $t("categorys.United States") }}
        </el-dropdown-item>
        <el-dropdown-item command="GB"
          ><sui-flag name="United Kingdom" />{{
            $t("categorys.United Kingdom")
          }}
        </el-dropdown-item>
        <el-dropdown-item command="AU">
          <sui-flag name="Australia" />{{ $t("categorys.Australia") }}
        </el-dropdown-item>
        <el-dropdown-item command="DE">
          <sui-flag name="Germany" />{{ $t("categorys.Germany") }}
        </el-dropdown-item>
        <el-dropdown-item command="CA">
          <sui-flag name="Canada" />{{ $t("categorys.Canada") }}
        </el-dropdown-item>
        <el-dropdown-item command="FR">
          <sui-flag name="France" />{{ $t("categorys.France") }}
        </el-dropdown-item>
        <el-dropdown-item command="MX">
          <sui-flag name="Mexico" />{{ $t("categorys.Mexico") }}
        </el-dropdown-item>
        <el-dropdown-item command="NL">
          <sui-flag name="Netherlands" />{{ $t("categorys.Netherlands") }}
        </el-dropdown-item>
        <el-dropdown-item command="IT">
          <sui-flag name="Italy" />{{ $t("categorys.Italy") }}
        </el-dropdown-item>
        <el-dropdown-item command="ES">
          <sui-flag name="Spain" />{{ $t("categorys.Spain") }}
        </el-dropdown-item>
        <el-dropdown-item command="more" divided>
          <!-- {{ $t("common.more") }} -->
          <country-select @select="selectCountry"></country-select>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- <el-dialog
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="$t('common.more') + $t('common.country')"
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
          v-for="(item, index) in Object.keys(currencyObj)"
          :key="`currency_${index}`"
        >
          <h2>{{ item }}</h2>
          <template v-for="(ic, inx) in currencyObj[item]">
            <el-button
              class="countryName-btn"
              :key="inx"
              @click="localeCountryName(ic.isoCode)"
            >
              <sui-flag :name="ic.countryName" />
              {{ ic.countryName }}
            </el-button>
          </template>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col>
          <h2>{{ list._key }}</h2>
          <el-button
            class="currency-btn"
            @click="localeCountryName(list.isoCode)"
          >
            <sui-flag :name="list.name" />{{ list.value }}
          </el-button>
        </el-col>
      </el-row>
    </el-dialog> -->
    <!-- <template v-for="item in country">
        <el-button
          class="countryName-btn"
          :key="item.countryName"
          @click="localeCountryName(item.isoCode)"
        >
          <sui-flag :name="item.countryName" />
          {{ $t("categorys." + item.countryName) }}
        </el-button>
      </template> -->
  </div>
</template>


<script>
import SuiFlag from "./Flag";
import { GetCountryList, GetAddressList } from "@/utils/api";
import CountrySelect from "@/components/CountrySelect";
import { get } from "lodash";

export default {
  components: { SuiFlag, CountrySelect },
  data() {
    return {
      dialogTableVisible: false,
      country: [],
      restaurants: [],
      state: "",
      isShow: true,
      currencyObj: {},
      list: {},
      timeout: null,
    };
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
    currencyLine() {
      return Object.keys(this.currencyObj);
    },
    // 国家
    fromcountry() {
      return this.$store.state.user.country;
    },
    countryName() {
      return this.$store.state.countryName;
    },
    countryMap() {
      return this.country.reduce(
        (a, v) => ({
          ...a,
          [v.isoCode]: v.countryName,
        }),
        {}
      );
    },
    countryNameToCodeMap() {
      return this.country.reduce(
        (a, v) => ({
          ...a,
          [v.countryName]: v.isoCode,
        }),
        {}
      );
    },
  },
  async created() {
    // this.restaurants = this.getCountryList();
    // const countryName = localStorage.getItem("countryName");
    // 如果用户有收货地址，那就读取收货地址上的国家
    await this.getCountryList();
    const token = localStorage.getItem("auth_token")
    if (token) {
      const res = await GetAddressList({})
      const userAddress = get(res, 'data.rows')
      let defaultAddress = get(res, 'data.rows[0]')
      if (Array.isArray(userAddress) && userAddress.length) {
        const find = userAddress.find(item => item.isDefault)
        if (find) {
          defaultAddress = find
        }
      }
  
      if (defaultAddress && defaultAddress.country) {
        this.selectCountry(this.countryNameToCodeMap[defaultAddress.country])
        return
      }
    }
    const countryName = this.$store.state.countryName;
    if (countryName) {
      this.$store.commit("setcountryName", countryName);
    }
  },
  methods: {
    selectCountry(e) {
      // console.log(e, "selectCountry");
      this.$store.commit("setcountryName", e);
    },
    // getListKey() {
    //   let str = [];
    //   for (let i = 65; i < 91; i++) {
    //     str.push(String.fromCharCode(i));
    //   }
    //   return str;
    // },
    // handleSelect(item) {
    //   console.log(item, this.state);
    //   if (item) {
    //     this.list = item;
    //     this.isShow = false;
    //   }
    // },
    // querySearch(queryString, cb) {
    //   var restaurants = this.restaurants;
    //   // 解决element建议搜索框无法显示内容 的数据处理
    //   for (var i = 0; i < restaurants.length; i++) {
    //     restaurants[i].value = restaurants[i].countryName;
    //   }
    //   var results = queryString
    //     ? restaurants.filter(this.createFilter(queryString))
    //     : restaurants;
    //   // 调用 callback 返回国家的数据
    //   clearTimeout(this.timeout);
    //   this.timeout = setTimeout(() => {
    //     cb(results);
    //   }, 3000 * Math.random());
    //   // cb(results);
    // },
    // createFilter(queryString) {
    //   return (restaurant) => {
    //     return (
    //       restaurant.countryName
    //         .toLowerCase()
    //         .indexOf(queryString.toLowerCase()) === 0
    //     );
    //   };
    // },
    getCountryList() {
      GetCountryList().then((res) => {
        // console.log("GetCountryList-res", res);
        this.country = res.data.rows;
        // this.restaurants = res.data.rows;
        // console.log(this.country, "country");
        // let _A_Z_List = this.getListKey();
        // console.log(_A_Z_List);
        // let _currency = this.country.map((item) => {
        //   item["_key"] = item.countryName.slice(0, 1).toLocaleUpperCase();
        //   return item;
        // });
        // console.log(_currency);
        // for (var i = 0; i < _A_Z_List.length; i++) {
        //   this.currencyObj[_A_Z_List[i]] = [];
        //   for (let j = 0; j < _currency.length; j++) {
        //     if (_currency[j]._key === _A_Z_List[i]) {
        //       this.currencyObj[_A_Z_List[i]].push(_currency[j]);
        //     }
        //   }
        //   if (!this.currencyObj[_A_Z_List[i]].length) {
        //     delete this.currencyObj[_A_Z_List[i]];
        //   }
        // }
        // console.log(
        //   this.currencyObj,
        //   Object.keys(this.currencyObj),
        //   " currencyObj"
        // );
      });
    },
    localeCountryName(countryName) {
      // console.log("localeCurrency:", countryName);
      if (countryName === "more") {
        // this.dialogTableVisible = true;
      } else {
        this.$store.commit("setcountryName", countryName);
        this.dialogTableVisible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.shipping-country {
  background: #fff;
  @include mobile {
    padding-bottom: 5%;
  }
}
.countryName-btn {
  margin-bottom: 10px;
}
</style>