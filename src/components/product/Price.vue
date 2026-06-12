<template>
  <div class="price" :class="size" :style="{ color }">
    <!-- {{ value}} : {{ form }}
    {{erMap[current]}},{{form}},{{ exchangeRate }} -->
    <!-- {{ exchange }},{{ current }},{{ exchangeRate }},{{ value }},{{
      value * exchangeRate
    }} -->
    <span v-if="unit" class="unit">
      {{ unitString }}
    </span>
    {{ $utils.formatToDecimal(exchange ? value * exchangeRate : value) }}
  </div>
</template>

<script>
import { GetExchateRateMap } from "@/utils/api";
export default {
  props: {
    unit: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Number,
    },
    size: {
      type: String,
      default: "s",
    },
    color: {
      type: String,
      default: "#ef2e22",
    },
    form: {
      type: String,
      default: "USD",
    },
    to: {
      type: String,
      default: "",
    },
    // erMap: {
    //   type: Object,
    //   default() {
    //     return {};
    //   },
    // },
  },
  computed: {
    erMap() {
      return this.$store.state.exchateRateMap;
    },
    exchange() {
      // 检查原始货币单位 与 目标货币单位 是否相同，来判断是否需要转换
      return this.form !== this.current;
    },
    current() {
      // 传入目标货币单位优先 与 全局货币单位
      return this.to || this.$store.state.currency || "USD";
    },
    unitString() {
      const strMap = {
        CNY: "CN¥",
        USD: "US$",
        CHF: "CHF",
        HKD: "HK$",
        JPY: "JP¥",
        GBP: "GBP£",
        CAD: "CA$",
        EUR: "EUR€",
        KRW: "KRW원",
        AUD: "AU$",
        ARS: "EUR€",
        BRL: "GBP£",
        CVE: "CA$",
        RMB: "CN¥",
        CLP: "CLP",
        COP: "COP",
        CDF: "CA$",
        EGP: "EGP",
        ETB: "ETB",
        GMD: "GMD",
        GHS: "GHS",
        GNF: "GNF",
        KES: "KES",
        LRD: "LRD",
        MWK: "MWK",
        MXN: "MXN",
        MAD: "MAD",
        MZN: "MZN",
        MUR: "MUR",
        NGN: "₦",
        RWF: "RWF",
        SLL: "SLL",
        STD: "STD",
        ILS: "ILS",
        TRY: "TRY",
        ZAR: "ZAR",
        TZS: "TZS",
        UGX: "UGX",
        XAF: "XAF",
        XOF: "FCFA",
        ZMK: "ZMK",
        ZMW: "ZMW",
        AED: "AED",
        AFN: "AFN",
        ALL: "ALL",
        AMD: "AMD",
        ANG: "ANG",
        AOA: "AOA",
        AWG: "AWG",
        AZN: "AZN",
        BAM: "BAM",
        BBD: "BBD",
        BDT: "BDT",
        BGN: "BGN",
        BHD: "BHD",
        BIF: "BIF",
        BMD: "BMD",
        BND: "BND",
        BOB: "BOB",
        BSD: "BSD",
        BTC: "BTC",
        BTN: "BTN",
        BWP: "BWP",
        BYN: "BYN",
        BYR: "BYR",
        BZD: "BZD",
        CLF: "CLF",
        CRC: "CRC",
        CUC: "CUC",
        CUP: "CUP",
        CZK: "CZK",
        DJF: "DJF",
        DKK: "DKK",
        DOP: "DOP",
        DZD: "DZD",
        ERN: "ERN",
        FJD: "FJD",
        FKP: "FKP",
        GEL: "GEL",
        GGP: "GGP",
        GIP: "GIP",
        GTQ: "GTQ",
        GYD: "GYD",
        HNL: "HNL",
        HRK: "HRK",
        HTG: "HTG",
        HUF: "HUF",
        IDR: "IDR",
        IMP: "IMP",
        INR: "INR",
        IQD: "IQD",
        IRR: "IRR",
        ISK: "ISK",
        JEP: "JEP",
        JMD: "JMD",
        JOD: "JOD",
        KGS: "KGS",
        KHR: "KHR",
        KMF: "KMF",
        KPW: "KPW",
        KWD: "KWD",
        KYD: "KYD",
        KZT: "KZT",
        LAK: "LAK",
        LBP: "LBP",
        LKR: "LKR",
        LSL: "LSL",
        LTL: "LTL",
        LVL: "LVL",
        LYD: "LYD",
        MDL: "MDL",
        MGA: "MGA",
        MKD: "MKD",
        MMK: "MMK",
        MNT: "MNT",
        MOP: "MOP",
        MRO: "MRO",
        MVR: "MVR",
        MYR: "MYR",
        NAD: "NAD",
        NIO: "NIO",
        NOK: "NOK",
        NPR: "NPR",
        NZD: "NZD",
        OMR: "OMR",
        PAB: "PAB",
        PEN: "PEN",
        PGK: "PGK",
        PHP: "PHP",
        PKR: "PKR",
        PLN: "PLN",
        PYG: "PYG",
        QAR: "QAR",
        RON: "RON",
        RSD: "RSD",
        RUB: "RUB",
        SAR: "SAR",
        SBD: "SBD",
        SCR: "SCR",
        SDG: "SDG",
        SEK: "SEK",
        SGD: "SGD",
        SHP: "SHP",
        SLE: "SLE",
        SOS: "SOS",
        SRD: "SRD",
        SVC: "SVC",
        SYP: "SYP",
        SZL: "SZL",
        THB: "THB",
        TJS: "TJS",
        TMT: "TMT",
        TND: "TND",
        TOP: "TOP",
        TTD: "TTD",
        TWD: "TWD",
        UAH: "UAH",
        UYU: "UYU",
        UZS: "UZS",
        VEF: "VEF",
        VES: "VES",
        VND: "VND",
        VUV: "VUV",
        WST: "WST",
        XAG: "XAG",
        XAU: "XAU",
        XCD: "XCD",
        XDR: "XDR",
        XPF: "XPF",
        YER: "YER",
        ZWL: "ZWL",
      };
      return strMap[this.current];
    },
    exchangeRate() {
      return (
        (this.erMap[this.current] ? this.erMap[this.current].rate : 1) /
        (this.erMap[this.form] ? this.erMap[this.form].rate : 1)
      );
    },
  },
  created() {
    const nowUnix = Math.round(new Date().getTime() / 1000);
    // console.log("test-created-nowUnix:", this.unitString);

    if (this.$store.state.exchateRateMapLoading) {
      // console.log("test-created-is-loading");
    } else if (
      Object.keys(this.$store.state.exchateRateMap).length > 0 &&
      this.$store.state.exchateRateMapExpireAt > 0 &&
      this.$store.state.exchateRateMapExpireAt > nowUnix
    ) {
      // console.log("test-created-is-exist-valid");
    } else {
      this.$store.commit("setExchateRateMapLoading", true);
      const exchateRateMapExpireAt = localStorage.getItem(
        "exchateRateMapExpireAt"
      );
      const exchateRateMapString = localStorage.getItem("exchateRateMap");
      const exchateRateMap = exchateRateMapString
        ? JSON.parse(exchateRateMapString)
        : null;
      if (
        exchateRateMap &&
        Object.keys(this.$store.state.exchateRateMap).length > 0 &&
        exchateRateMapExpireAt > 0 &&
        exchateRateMapExpireAt > nowUnix
      ) {
        this.$store.commit("setExchateRateMapLoading", false);
        this.$store.commit("setExchateRateMap", exchateRateMap);
        this.$store.commit("setExchateRateMapExpireAt", exchateRateMapExpireAt);
      } else {
        GetExchateRateMap().then((res) => {
          // console.log("GetExchateRateMap-res:", res);
          this.$store.commit("setExchateRateMapLoading", false);
          this.$store.commit("setExchateRateMap", res.data.excateRateMap);
          this.$store.commit("setExchateRateMapExpireAt", res.data.expireTime);
          localStorage.setItem(
            "exchateRateMap",
            JSON.stringify(res.data.excateRateMap)
          );
          // 解决选择部分国家 商品价格前没有货币符号问题
          // let allCurrency = Object.keys(res.data.excateRateMap);
          // let strMap = {
          //   CNY: "CN¥",
          //   USD: "US$",
          //   CHF: "CHF",
          //   HKD: "HK$",
          //   JPY: "JP¥",
          //   GBP: "GBP£",
          //   CAD: "CA$",
          //   EUR: "EUR€",
          //   KRW: "KRW원",
          //   AUD: "AU$",
          //   ARS: "EUR€",
          //   BRL: "GBP£",
          //   CVE: "CA$",
          //   RMB: "CN¥",
          //   CLP: "CLP",
          //   COP: "COP",
          //   CDF: "CA$",
          //   EGP: "EGP",
          //   ETB: "ETB",
          //   GMD: "GMD",
          //   GHS: "GHS",
          //   GNF: "GNF",
          //   KES: "KES",
          //   LRD: "LRD",
          //   MWK: "MWK",
          //   MXN: "MXN",
          //   MAD: "MAD",
          //   MZN: "MZN",
          //   MUR: "MUR",
          //   NGN: "₦",
          //   RWF: "RWF",
          //   SLL: "SLL",
          //   STD: "STD",
          //   ILS: "ILS",
          //   TRY: "TRY",
          //   ZAR: "ZAR",
          //   TZS: "TZS",
          //   UGX: "UGX",
          //   XAF: "XAF",
          //   XOF: "FCFA",
          //   ZMK: "ZMK",
          //   ZMW: "ZMW",
          // };
          // // console.log(strMap);
          // strMap = Object.keys(strMap);
          // strMap.forEach((item1) => {
          //   allCurrency.forEach((item2, j) => {
          //     if (item2 == item1) {
          //       allCurrency.splice(j, 1);
          //       j -= 1;
          //     }
          //   });
          // });
          // // console.log(allCurrency);
          // let test = {};
          // allCurrency.map((v) => {
          //   // console.log(v);
          //   let key = v;
          //   let obj = {};
          //   obj[key] = v;
          //   test = Object.assign(strMap, obj);
          //   // console.log(obj);
          // });
          // console.log(test);
          // // // console.log(this.unitString);

          localStorage.setItem("exchateRateMapExpireAt", res.data.expireTime);
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.price {
  display: inline-block;
  color: #ef2e22;
  // color: #000;
  font-size: 16px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 1px;

  .unit {
    font-size: 14px;
  }
}

.m {
  font-size: 18px;

  .unit {
    font-size: 16px;
  }
}

.l {
  font-size: 20px;

  .unit {
    font-size: 16px;
  }
}
</style>