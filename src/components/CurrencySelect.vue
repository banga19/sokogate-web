<template>
  <el-select
    :value="value"
    :placeholder="$t('common.selectPlaceholder')"
    autocomplete="autocomplete"
    filterable
    @change="handleChange"
  >
    <template v-if="value" v-slot:prefix>
      <div class="flag" :class="classObject"></div>
    </template>
    <el-option-group
      v-for="group in gridData"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.name"
        :label="item.label"
        :value="item.value"
      >
        <sui-flag :name="item.iso_code" />
        {{ item.label }}
      </el-option>
    </el-option-group>
  </el-select>
</template>
<script>
import SuiFlag from "@/components/product/Flag";
export default {
  components: { SuiFlag },
  props: {
    value: {
      default: "",
    },
  },

  data() {
    return {
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
    };
  },

  created() {
    this.getCountry();
  },

  //   computed: {
  //     classObject: function () {
  //       if (this.country.length) {
  //         const selectCountry =
  //           this.country[0].options.find((v) => v.value === this.value) ||
  //           this.country[1].options.find((v) => v.value === this.value);
  //         if (selectCountry) {
  //           return {
  //             ["flag-" + selectCountry.iso_code]: !!this.value && !!selectCountry,
  //           };
  //         } else {
  //           return null;
  //         }
  //       } else {
  //         return null;
  //       }
  //     },
  //   },

  methods: {
    getCountry() {
      const allCountry = this.gridData.map((v) => {
        return {
          value: v.currency,
          iso_code: v.name,
          label: v.currency,
        };
      });
      const popularCountry = [
        "USD",
        "CNY",
        "HKD",
        "EUR",
        "GBP",
        "JPY",
        "CAD",
        "KRW",
        "AUD",
      ];
      this.$set(this.gridData, 1, {
        options: allCountry,
      });
      this.$set(this.gridData, 0, {
        options: allCountry.filter((v) => popularCountry.indexOf(v.label) > -1),
      });
    },
    handleChange(e) {
      console.log(e, "handleChange");
      this.$emit("select",e)
      //   this.$store.commit("setcurrentCountry", e);
      //   this.$emit("input", e);
    },
  },
};
</script>

<style>
/* @import url("@/style/flags.css"); */

.el-input--prefix .el-input__prefix {
  margin-left: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>