<template>
  <div class="price">{{ unitString }}{{ showTotal }}</div>
</template>

<script>
import { formatToDecimal } from "@/utils";
export default {
  props: {
    value: Number,
    to: {
      type: String,
      default: "",
    },
  },
  computed: {
    current() {
      // Pass in目标货币单位优先 与 全局货币单位
      return this.to || "USD";
    },
    unitString() {
      const strMap = {
        CNY: "CN¥",
        USD: "US$",
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
        GMD: "GMD",
        GHS: "GHS",
        GNF: "GNF",
        KES: "KES",
        LRD: "LRD",
        MWK: "MWK",
        MXN: "MXN",
        MAD: "MAD",
        MZN: "MZN",
        NGN: "NGN",
        RWF: "RWF",
        SLL: "SLL",
        STD: "STD",
        ZAR: "ZAR",
        TZS: "TZS",
        UGX: "UGX",
        XAF: "XAF",
        XOF: "XOF",
        ZMK: "ZMK",
        ZMW: "ZMW",
      };
      return strMap[this.current];
    },
    showTotal: function () {
      return formatToDecimal(this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.price {
  color: #ef2e22;
  font-size: 16px;
}
</style>