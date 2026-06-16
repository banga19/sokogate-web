<template>
  <div class="product">
    <br />
    <b-card class="product-card">
      <b-row class="order-head">
        <el-checkbox v-if="edit" class="select-all" v-model="isCheckAll">
          全选
        </el-checkbox>
        <b-col cols="4" class="order-head-first">
          {{ $t("order.product") }}
        </b-col>
        <b-col cols="2">{{ $t("order.color") }}</b-col>
        <b-col cols="2">{{ $t("order.size") }}</b-col>
        <b-col cols="2">{{ $t("order.price") }}</b-col>
        <b-col cols="2">{{ $t("order.quantity") }}</b-col>
      </b-row>
    </b-card>
    <div
      v-for="(item, index) in listWithCbmWeightTotal"
      :key="`plist_${index}`"
      class="product-wrap"
    >
      <b-card class="product-list">
        <b-card-title class="product-list-store">
          <el-checkbox
            v-if="edit"
            class="select-store"
            :value="storeChecked[item.store.id]"
            @change="handleStoreCheckedChange($event, item.store.id)"
          ></el-checkbox>
          <i
            class="sokogate icon-shop"
            style="font-size: 24px; color: #ef2e22"
          />
          {{ $t("order.seller") }}: 
          {{ item.store.name }}
        </b-card-title>
        <product-box
          v-for="(product, index) in item.product"
          :key="`product_${index}`"
          :item="product"
          :edit="edit"
          :erMap="erMap"
          :checked="checked"
          @set="onSet"
          @change="delCart"
          @select="selectCart"
        />
        <b-row v-if="item.cbm">
          <b-col align="right">
            {{ $t("counter.Totalcapacity") }}:
            <div class="price">{{ $utils.keepTwoDecimal(item.cbm) }}</div>
            CBM
            <!-- <template v-if="logisticsPrice">
              , {{ $t("counter.Freightsubtotal") }}:
              <sui-product-price
                class="price"
                :value="item.cbm * (logisticsPrice * 10000)"
                size="m"
                :erMap="erMap"
                :form="item.product[0].currency"
              />
            </template> -->
            , 
            <div class="price">{{ $utils.keepTwoDecimal(item.weight) }}</div>
            KG
            <template v-if="item.total">
              , {{ $t("shoppingCart.total") }}({{
                $t("shoppingCart.notshipping")
              }}):
              <sui-product-price
                class="price"
                :value="item.total"
                size="m"
                :erMap="erMap"
                :form="'USD'"
              />
            </template>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script>
import ProductBox from "@/components/ProductBox";
import SuiProductPrice from "@/components/product/Price";

export default {
  components: {
    ProductBox,
    SuiProductPrice,
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    logisticsPrice: {
      type: Number,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    erMap() {
      if (Object.keys(this.$store.state.exchateRateMap).length === 0) {
        return null;
      } else {
        return this.$store.state.exchateRateMap;
      }
    },
    listWithCbmWeightTotal() {
      return this.erMap
        ? this.list.map((store) => {
            const cbm = this.$utils.getCbmWithList(store.product);
            const weight = this.$utils.getWeightWithList(store.product);
            return {
              ...store,
              cbm,
              weight,
              total: this.getUsdTotalWithList(store.product),
            };
          })
        : [];
    },
    isCheckAll: {
      get() {
        let res = true;
        try {
          Object.keys(this.checked).forEach((storeId) => {
            Object.keys(this.checked[storeId]).forEach((skuId) => {
              if (this.checked[storeId][skuId] === false) {
                throw new Error("发现空选择");
              }
            });
          });
        } catch (error) {
          res = false;
        }
        return res;
      },
      set(val) {
        // console.log("set:", val);
        Object.keys(this.checked).forEach((storeId) => {
          Object.keys(this.checked[storeId]).forEach((skuId) => {
            this.checked[storeId][skuId] = val;
          });
        });
      },
    },
    storeChecked: {
      get() {
        return Object.keys(this.checked).reduce((a, storeId) => {
          return {
            ...a,
            [storeId]: !Object.values(this.checked[storeId]).some(
              (v) => v === false
            ),
          };
        }, {});
      },
    },
  },
  methods: {
    handleStoreCheckedChange(val, storeId) {
      // console.log("handleStoreCheckedChange:", val, storeId);
      Object.keys(this.checked[storeId]).forEach((skuId) => {
        this.checked[storeId][skuId] = val;
      });
    },
    onSet(e) {
      this.$emit("set", e);
    },
    delCart(e) {
      // console.log("delCart", e);
      this.$emit("del", e);
    },
    selectCart(e) {
      // console.log("selectCart-e", e);
      this.$emit("select", e);
    },
    getUsdTotalWithList(list) {
      return list
        .map((p) => {
          const sum = p.list
            .map((color) => {
              const newSpecs = color.specs.map((spec) => {
                return {
                  ...spec,
                  // Store product currency unit in each row
                  rate: 1 / this.erMap[p.currency].rate,
                };
              });
              // console.log("newSpecs:", newSpecs);
              return newSpecs;
            })
            .reduce((a, v) => a.concat(v), [])
            .reduce((a, v) => a + v.num * (v.price * v.rate), 0);
          return sum > 0.01 ? sum : 0.01;
        })
        .reduce((a, v) => Number(a) + Number(v), 0);
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.product {
  &-list {
    margin-top: 15px;
    @include mobile {
      margin: 15px 10px;
    }

    &-store {
      display: flex;
      align-items: center;
    }
  }
  .order-head {
    position: relative;

    .select-all {
      position: absolute;
      display: inline-block;
      left: 0;
      font-size: 16px;
    }

    &-first {
      text-align: center;
      @include mobile {
        text-align: right;
      }
    }

    // & > * {
    //   display: flex;
    //   justify-content: center;
    // }
  }

  &-card {
    @include mobile {
      margin: 0 10px;
    }
  }
  .price {
    display: inline-block;
    padding-left: 5px;
  }

  .select-store {
    margin-right: 8px;
  }
}
</style>