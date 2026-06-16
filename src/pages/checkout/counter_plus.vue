<template>
  <b-container v-if="orderList && orderList.length" class="order">
    <div v-title :data-title="$t('order.chechout')">
      <!-- {{ erMap }} -->
      <!-- <p>{{ orderList }}</p> -->
      <!-- <p>{{ productList }}</p> -->
      <!-- {{ isMail }} -->
      <div v-title :data-title="$t('order.chechout')">
        <order-steps :active="0" />
        <b-overlay :show="!(orderList && orderList.length)" rounded="lg">
          <select-address v-model="userAddressId" @change="countryChange" />
          <select-logistics
            :is-mail="isMail"
            v-model="logistics.price"
            :weight="weightTotal"
            @change="logisticsChange"
            @select="selectcountry"
            @setLoading="setLoading"
          />
          <template>
            <product-list
              :list="orderList"
              :logistics-price="logistics.price"
            />
          </template>
        </b-overlay>
      </div>
      <!-- {{ logistics }} -->
      <check-out-bar
        :order-list="orderList"
        :weight="weightTotal"
        :cbm="CBMTotal"
        :logistics-price="logistics.price"
        @submit="addOrder"
        :loading="loading"
      />
    </div>
  </b-container>
</template>
<script>
import ProductList from "@/components/ProductList";
import SelectAddress from "@/components/SelectAddress";
import SelectLogistics from "@/components/SelectLogistics";
import OrderSteps from "@/components/OrderSteps";
import CheckOutBar from "@/components/CheckOutBar";
import { AddOrder, GetSpu } from "@/utils/api";
// import { GetSpu } from "@/utils/api";

export default {
  components: {
    ProductList,
    SelectAddress,
    SelectLogistics,
    CheckOutBar,
    OrderSteps,
  },
  data() {
    return {
      orderList: [],
      logistics: {
        price: 0,
      },
      userAddressId: 0,
      loading: true,
      classList: [],
      storageTrue: null,
      fromPath: null,
      skuLadderList: [],
      trueList: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log(from, "fromfdsakfdalsdklkl");
      //  这里的vm指的就是vue实例, 可以用来当做this使用
      vm.fromPath = from.path; // Get上一级路由的路径
    });
  },
  computed: {
    // 汇率
    erMap() {
      return this.$store.state.exchateRateMap;
    },
    params() {
      return this.$route.params;
    },
    productList: function () {
      return this.orderList
        .map((seller) => {
          return seller.product
            .map((product) => {
              return product.list
                .map((color) => {
                  return color.specs.map((specs) => {
                    return {
                      pcs: specs.num,
                      skId: specs.skId,
                    };
                  });
                })
                .reduce((a, v) => a.concat(v), []);
            })
            .reduce((a, v) => a.concat(v), []);
        })
        .reduce((a, v) => a.concat(v), []);
    },
    weightTotal: function () {
      return this.orderList
        .map((seller) => {
          const weight = this.$utils.getWeightWithList(seller.product);
          return weight;
        })
        .reduce((a, v) => Number(a) + Number(v), 0);
    },
    CBMTotal() {
      return this.orderList
        .map((seller) => {
          return this.$utils.getCbmWithList(seller.product);
        })
        .reduce((a, v) => a + v, 0);
    },
    categoryIdList: function () {
      return this.orderList
        .map((seller) => {
          return seller.product
            .map((product) => {
              if (!product.categoryIdList) {
                return this.classList;
              } else {
                return product.categoryIdList;
              }
            })
            .reduce((a, v) => a.concat(v), []);
        })
        .reduce((a, v) => a.concat(v), []);
    },
    isMail() {
      // console.log(sessionStorage.getItem("isTrue"), 'this.categoryIdListthis.categoryIdListthis.categoryIdList');
      // 判断上个页面
      //   console.log(this.fromPath, "path");
      if (this.fromPath === "/v2/product/detail") {
        // console.log(this.skuLadderList, "dsadasdasd");
        if (this.skuLadderList[0].freeShipping === 1) {
          sessionStorage.setItem("isTrue", JSON.stringify(true));
          return true;
        } else {
          sessionStorage.setItem("isTrue", JSON.stringify(false));
          return false;
        }
      } else {
        if (this.storageTrue != null) {
          return this.storageTrue;
        } else {
          let isTrue = this.trueList.some((c) => c == false);
          //   console.log(isTrue, "istrueistrue");
          sessionStorage.setItem("isTrue", JSON.stringify(!isTrue));
          return !isTrue;
        }
      }
    },
  },

  // watch: {
  //   "$route.params": function () {
  //     if (this.$route.path === "/v2/checkout/counter_plus") {
  //       this.orderList = [];
  //       this.logistics = {
  //         price: 0,
  //       };
  //       this.userAddressId = 0;
  //       this.getNewOrder();
  //     }
  //   },
  // },

  watch: {
    $route: {
      handler(val) {
        console.log(val, "val");
      },
    },
    deep: true,
    immediate: true,
  },
  created() {
    // console.log("created:", "this.getNewOrder()");
    // console.log(this.$route.params);
    this.classList = []; // 防止多次结算污染
    this.getNewOrder();
  },
  // 页面销毁之前
  beforeDestroy() {
    sessionStorage.removeItem("paramsData");
    sessionStorage.removeItem("isTrue");
  },
  methods: {
    setLoading(e) {
      // console.log("setLoading-e", e);
      this.loading = e;
    },
    selectcountry(e) {
      this.logistics = {
        ...this.logistics,
        ...e,
      };
      if(this.logistics.orderLogistics.LogisticsId !== 0 ){
        this.logistics.logisticsType = 201;
        this.logistics.logisticsPriceId = this.logistics.orderLogistics.LogisticsId;
      } else if(this.logistics.orderLogistics.LogisticsId == 0){
        this.logistics.logisticsType = 301;
        this.logistics.logisticsPriceId = 0 ;
      }else{
        this.logistics.logisticsType = 401;
        this.logistics.logisticsPriceId = 0 ;
      }
      console.log("seleCtcountry", this.logistics);
    },
    logisticsChange(e) {
      this.logistics = {
        ...this.logistics,
        ...e,
      };
      console.log("logisticsChange",this.logistics);
    },
    countryChange(e) {
      // Get改变的国家
      this.$store.commit("setselectCountry", e);
    },
    getNewOrder() {
      let that = this;
      // console.log(
      //   "this.$store.getters.authTokenIsValid:",
      //   this.$store.getters.authTokenIsValid
      // );
      // const { newOrder } = this.$route.params;
      // sessionStorage.setItem("paramsData", JSON.stringify(newOrder));
      // this.orderList = newOrder;
      // console.log(this.$route.params, "params");
      var paramsData = sessionStorage.getItem("paramsData");
      if (paramsData) {
        var params = JSON.parse(sessionStorage.getItem("paramsData"));
        this.orderList = params;
        that.storageTrue = JSON.parse(sessionStorage.getItem("isTrue"));
        if (!params) {
          this.$router.go(-1);
        }
      } else {
        const { newOrder } = this.$route.params;
        newOrder.map((v) => {
          return v.product.map((k) => {
            // console.log(k.categoryIdList, 'kkkkkkkkk')
            if (!k.categoryIdList) {
              GetSpu({ id: k.id })
                .then((res) => {
                  // console.log("GetSpu-res:", res.data.categoryIdList);
                  that.classList.push(res.data.categoryIdList);
                  //   that.skuLadderList.push(...res.data.skuLadderList);
                  that.skuLadderList = res.data.skuLadderList;
                  //   console.log(that.classList, 'yyyyyyyyyyyyyyyyy')

                  let skuLadderList = res.data.skuLadderList;
                  //   console.log(skuLadderList, categoryIdList, "resresres");
                  if (skuLadderList.length > 0) {
                    if (skuLadderList[0].freeShipping === 1) {
                      return that.trueList.push(true);
                    } else {
                      return that.trueList.push(false);
                    }
                  }
                })
                .catch((err) => {
                  console.log("GetSpu-err:", err);
                });
            }
          });
        });
        this.orderList = newOrder;
        // console.log(that.classList,"newnewanewa")
        if (newOrder[0].skuLadderList) {
          this.skuLadderList = newOrder[0].skuLadderList;
        }
        sessionStorage.setItem("paramsData", JSON.stringify(newOrder));
        if (!this.orderList) {
          this.$router.go(-1);
        }
      }
      // console.log("orderList", this.orderList);
    },

    addOrder() {
      const data = {
        cartList: this.productList,
        userAddressId: this.userAddressId,
        ...this.logistics,
        currency: this.$store.state.currency,
        /* 固定传值 1, 现在要求全部订单都享受首购5%折扣 */
        isUserOnePay: 1,
      };
      delete data["price"];
      console.log("addOrder-data:", data);
      AddOrder(data)
        .then((res) => {
          // console.log("AddOrder-res:", res);
          this.$router.push({
            name: "payment",
            query: {
              ids: res.data.map((v) => v.id).join(","),
            },
          });
        })
        .catch((err) => {
          console.log("addOrder-err:", err);
          this.$bvToast.toast(`${err.errmsg}`, {
            toaster: "b-toaster-top-center",
            variant: "danger",
            appendToast: false,
            noCloseButton: true,
            autoHideDelay: 3000,
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.order {
  padding-top: 50px;
  &-steps {
    padding: 30px 0;
    justify-content: center;
  }
}
</style>