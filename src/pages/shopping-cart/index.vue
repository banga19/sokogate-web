<template>
  <b-container class="order" v-loading="pageLoading">
    <template v-if="storeProductList && storeProductList.length">
      <div v-title :data-title="$t('menuitems.account.shoppingcart')">
        <b-overlay :show="requestLoading" rounded="lg">
          <!-- <p>{{list}}</p> -->
          <!-- {{ erMap }} -->
          <!-- <p>{{ storeProductList }}</p> -->
          <!-- <p>{{ listSelectFilter }}</p> -->
          <!-- {{productList}} -->
          <product-list
            :list="storeProductList"
            :logistics-price="0"
            :edit="true"
            :checked="checked"
            @set="updateCart"
            :erMap="erMap"
            @del="getList"
            @select="updateCartBySpec"
          />
          <!-- <p>{{ checked }}</p>
          <p>{{ checkedIdMap }}</p> -->
          <check-out-bar
            :order-list="listSelectFilter"
            :logistics-price="0"
            :weight="totalWeight"
            :cbm="totalCBM"
            :btn-text="$t('order.placeOrder')"
            @submit="goCheckout"
          />
        </b-overlay>
      </div>
    </template>
    <div v-else-if="isEmpty" class="empty-wrap">
      <el-empty :description="$t('productList.noData')"></el-empty>
    </div>
  </b-container>
</template>

<script>
import { GetCartList, AddCart, UpdateCart } from "@/utils/api";
import ProductList from "@/components/ProductList";
import CheckOutBar from "@/components/CheckOutBar";

export default {
  components: {
    ProductList,
    CheckOutBar,
  },
  data() {
    return {
      requestLoading: true,
      list: [],
      checked: {},
      pageLoading: false,
    };
  },
  // watch: {
  //   "$route.path": function (newVal, oldVal) {
  //     if (newVal !== oldVal && this.$route.path === "/v2/shopping-cart") {
  //       this.list = [];
  //       this.getList();
  //     }
  //   },
  // },
  computed: {
    isEmpty() {
      return this.list.length === 0;
    },
    // 汇率
    erMap() {
      return (
        this.list[0].spu.exchangeRateList
          ? this.list[0].spu.exchangeRateList
          : []
      ).reduce((a, v) => {
        return {
          ...a,
          [v.currencyFrom]: v.rate,
        };
      }, {});
    },
    checkedIdMap() {
      // console.log("this.checked:", this.checked);
      return Object.values(this.checked).reduce((a, v) => {
        return { ...a, ...v };
      }, {});
    },
    listSelectFilter() {
      return this.storeProductList
        .map((store) => {
          const { product, ...others } = store;
          return {
            ...others,
            product: product
              .map((product) => {
                const { list, ...others } = product;
                // console.log("list:", list);
                return {
                  ...others,
                  list: list
                    .map((color) => {
                      const { specs, ...others } = color;
                      return {
                        ...others,
                        specs: specs.filter(
                          (spec) => this.checkedIdMap[spec.skuId] === true
                        ),
                      };
                    })
                    .filter((color) => color.specs.length > 0),
                };
              })
              .filter((product) => product.list.length > 0),
          };
        })
        .filter((store) => store.product.length > 0);
    },
    skuList() {
      return this.list
        .map((sk) => {
          const { sku, spu } = sk;
          // console.log(sk, "sk");
          const {
            // specIdList: [colorId, sizeId],
            // skuLadder: { max, min },
            skId,
            id,
            stock,
            price,
            spuSpecSku: {
              specParam: { color, size },
            },
          } = sku;
          // if (sk.pcs > 0 && min <= sk.pcs && sk.pcs <= max) {
          return {
            spuId: spu.id,
            skuId: id,
            skId,
            pcs: sk.pcs,
            cartId: sk.id,
            stock,
            price,
            color,
            size,
          };
          // } else {
          //   return null;
          // }
        })
        .filter(Boolean);
    },
    storeIdList() {
      return Object.keys(
        this.list.reduce((all, cart) => {
          return {
            ...all,
            [cart.store.id]: cart,
          };
        }, {})
      );
    },
    storeProductList() {
      return this.storeIdList.map((storeId) => {
        const product = this.productList.filter(
          (product) => product.store.id === storeId
        );
        const store = product[0].store;
        return {
          product,
          store,
          cbm: 0,
        };
      });
      // return Object.values(
      //   this.list.reduce((all, cart) => {
      //     return {
      //       ...all,
      //       [cart.store.id]: {
      //         ...all[cart.store.id],
      //         [cart.id]: cart,
      //       },
      //     };
      //   }, {})
      // );
      // .map((v) => {
      //   const product = Object.values(v);
      //   const store = product[0].store;
      //   return {
      //     store: {
      //       ...store,
      //       name: store.storeName,
      //     },
      //     product,
      //   };
      // });
    },
    productList() {
      return Object.values(
        this.list.reduce((all, cart) => {
          const {
            spu: {
              id,
              currency,
              spuName,
              galleryList,
              volume,
              weight,
              exchangeRateList,
              translationMap,
              skuList,
              specParam,
            },
            store,
          } = cart;
          return {
            ...all,
            [id]: {
              id,
              currency,
              name: spuName,
              img: galleryList[0],
              exchangeRateList,
              translationMap,
              volume: {
                size: volume,
                unit: "M",
              },
              weight: {
                size: weight,
                unit: "KG",
              },
              store: {
                ...store,
                name: store.storeName,
              },
              skuList,
              specParam,
              list: Object.values(
                this.skuList
                  .filter((sku) => sku.spuId === id)
                  .reduce((a, v) => {
                    return {
                      ...a,
                      [v.color.id]: {
                        id: v.color.id,
                        name: v.color.specName,
                        specs: this.skuList
                          .filter((sku) => sku.color.id === v.color.id)
                          .map((sku) => {
                            // console.log("sku", sku);
                            return {
                              skId: sku.skId,
                              skuId: sku.skuId,
                              id: sku.size.id,
                              name: sku.size.specName,
                              price: sku.price,
                              num: sku.pcs,
                              cartId: sku.cartId,
                            };
                          }),
                      },
                    };
                  }, {})
              ),
            },
          };
        }, {})
      );
    },
    totalCBM() {
      return this.listSelectFilter
        .map((store) => {
          return this.$utils.getCbmWithList(store.product);
        })
        .reduce((a, v) => a + v, 0);
    },
    totalWeight() {
      return this.listSelectFilter
        .map((store) => {
          return this.$utils.getWeightWithList(store.product);
        })
        .reduce((a, v) => a + v, 0);
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.requestLoading = true;
      this.pageLoading = true;
      GetCartList({})
        .then((res) => {
          // console.log(res);
          this.list = res.data.rows;
          this.$store.commit("cartCountSet", res.data.rows.length);
          this.$nextTick(this.initChecked(res.data.rows));
          this.requestLoading = false;
          this.pageLoading = false;
        })
        .catch(() => {
          // console.log(err);
          this.requestLoading = false;
          this.pageLoading = false;
        });
    },

    initChecked(list) {
      // console.log("list:", list);
      const storeList = list.reduce((all, cart) => {
        const skList = list.filter((v) => cart.store.id === v.store.id);
        return {
          ...all,
          [cart.store.id]: skList.reduce((all, sk) => {
            return {
              ...all,
              [sk.sku.id]: false,
            };
          }, {}),
        };
      }, {});
      // console.log("storeList:", storeList);
      this.checked = storeList;
    },

    updateCart(req) {
      this.requestLoading = true;
      AddCart(req)
        .then((res) => {
          // console.log("AddCart-res:", res);
          if (res.data) {
            this.$store.commit("cartCountSet", res.data.rows.length);
            this.$message({
              showClose: false,
              message: this.$t("common.updateSuccess"),
              type: "success",
            });
            this.requestLoading = false;
            this.$nextTick(this.getList());
          }
        })
        .catch((err) => {
          console.log("AddCart-err:", err);
          this.requestLoading = false;
        });
    },
    // Update cart item
    updateCartBySpec(req) {
      // console.log("updateCartBySpec", req);
      this.requestLoading = true;
      UpdateCart(req)
        .then((res) => {
          // console.log("UpdateCart-res", res);
          if (res.data) {
            this.$store.commit("cartCountSet", res.data.rows.length);
            this.$message({
              showClose: false,
              message: this.$t("common.updateSuccess"),
              type: "success",
            });
            this.requestLoading = false;
            this.$nextTick(this.getList());
          }
        })
        .catch((err) => {
          console.log("UpdateCart-err", err);
          this.requestLoading = false;
        });
    },
    goCheckout() {
      if (this.listSelectFilter.length) {
        this.$utils.navWithParams("checkoutCounterPlus", {
          newOrder: this.listSelectFilter,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order {
  padding-top: 50px;
  ::v-deep {
    .navbar {
      margin: 0;
      .container {
        border-radius: 8px 8px 0 0;
      }
    }
  }
}
</style>