<template>
  <div>
    <b-navbar fixed="bottom" class="checkout">
      <b-container>
        <!-- {{totalFreight}} / {{logisticsPrice}} -->
        <b-navbar-nav></b-navbar-nav>
        <b-navbar-nav align="right">
          <b-nav-text class="summarize">
            <span class="label">{{ $t("order.seller") }}</span>
            <span class="value">{{ orderList.length }}</span>
            <span class="label">{{ $t("order.variety") }}</span>
            <span class="value">{{ variety }}</span>
            <span class="label">{{ $t("order.pieces") }}</span>
            <span class="value">{{ pieces }}</span>
            <template>
              <span class="label">CBM</span>
              <span class="value">
                {{ $utils.keepTwoDecimal(cbm) }}
              </span>
            </template>
            <template>
              <span class="label">{{ $t("shipping.weight") }}</span>
              <span class="value"> {{ $utils.keepTwoDecimal(weight) }}KG </span>
            </template>
            <template v-if="totalFreight > 0">
              <span class="label">{{ $t("order.freight") }}</span>
              <span class="value">
                <sui-product-price
                  :value="totalFreight"
                  size="m"
                  :erMap="erMap"
                  :form="'CNY'"
                />
              </span>
            </template>
            <span class="label appear">{{ $t("order.totalAmount") }}</span>
            <span class="value appear">
              <sui-product-price
                :value="totalAmount + totalFreightUSD"
                size="m"
                :erMap="erMap"
                :form="'USD'"
              />
            </span>
          </b-nav-text>
          <b-button
            :disabled="disabled === loading ? true : false"
            class="paybtn"
            size="lg"
            squared
            variant="danger"
            @click="submit"
          >
            {{ btnText || this.$t("common.submit") }}
          </b-button>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
    <div class="bottom-space"></div>
  </div>
</template>

<script>
import SuiProductPrice from "@/components/product/Price";

export default {
  components: {
    SuiProductPrice,
  },
  props: {
    orderList: {
      type: Array,
      default() {
        return [];
      },
    },
    logisticsPrice: {
      type: Number,
    },
    weight: {
      type: Number,
      default: 1,
    },
    cbm: {
      type: Number,
      default: 1,
    },
    btnText: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      disabled: true,
    };
  },
  computed: {
    erMap() {
      if (Object.keys(this.$store.state.exchateRateMap).length === 0) {
        return null;
      } else {
        return this.$store.state.exchateRateMap;
      }
    },
    // currency: function () {
    //   return this.orderList
    //     .map((seller) => {
    //       return seller.product
    //         .map((product) => {
    //           return product.currency;
    //         })
    //         .reduce((a, v) => a.concat(v), "");
    //     })
    //     .reduce((a, v) => a.concat(v), "");
    // },
    variety: function () {
      return this.orderList
        .map((seller) => {
          return seller.product
            .map((product) => {
              return product.list
                .map((color) => {
                  return color.specs;
                })
                .reduce((a, v) => a.concat(v), []);
            })
            .reduce((a, v) => a.concat(v), []);
        })
        .reduce((a, v) => a.concat(v), []).length;
    },
    pieces: function () {
      return this.orderList
        .map((seller) => {
          return seller.product
            .map((product) => {
              return product.list
                .map((color) => {
                  return color.specs;
                })
                .reduce((a, v) => a.concat(v), []);
            })
            .reduce((a, v) => a.concat(v), []);
        })
        .reduce((a, v) => a.concat(v), [])
        .reduce((a, v) => a + v.num, 0);
    },
    totalAmount: function () {
      // 单位：美金 this.totalFreight +
      if (this.erMap) {
        return (
          this.orderList
            .map((seller) => {
              console.log(seller.product);
              return seller.product
                .map((product) => {
                  console.log("product.currency:", product.currency);
                  return product.list
                    .map((color) => {
                      const newSpecs = color.specs.map((spec) => {
                        return {
                          ...spec,
                          // 把产品的货币单位存入每行中
                          rate: 1 / this.erMap[product.currency].rate,
                        };
                      });
                      console.log("newSpecs:", newSpecs);
                      return newSpecs;
                    })
                    .reduce((a, v) => a.concat(v), []);
                })
                .reduce((a, v) => a.concat(v), []);
            })
            .reduce((a, v) => a.concat(v), [])
            // 求和
            .reduce((a, v) => a + v.num * (v.price * v.rate), 0)
        );
      } else {
        return 0;
      }
    },
    //
    totalFreight: function () {
      return this.logisticsPrice * 100;
    },
    totalFreightUSD() {
      if (this.erMap && this.erMap["CNY"]) {
        return this.totalFreight * (1 / this.erMap["CNY"].rate);
      } else {
        return 0;
      }
    },
  },
  methods: {
    submit() {
      this.$emit("submit", {});
    },
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;

.checkout {
  padding: 0;

  & > * {
    background-color: #fff;
    height: 60px;
    box-shadow: 2px -5px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .summarize {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 20px 10px;

    @include mobile {
      padding: 0 10px;

      .label,
      .value {
        display: none;
        padding: 0;
      }
    }

    .label {
      padding-left: 10px;
      font-size: 12px;
      &:after {
        content: ":";
      }

      &:first-child {
        padding-left: 0;
      }
    }

    .value {
      color: #ef2e22;
      font-size: 16px;
      padding-left: 5px;
    }

    .appear {
      display: initial;
    }
  }

  p {
    text-align: center;
    margin: 0;
    width: 5em;
    height: 60px;
  }
}

.paybtn {
  width: 150px;
  background-color: #ef2e22;
  flex-shrink: 0;
}
</style>