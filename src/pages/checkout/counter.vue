<template>
  <b-container class="order">
    <div v-title :data-title="$t('order.chechout')">
      <order-steps :active="0" />
      <b-overlay :show="orderLoading" rounded="lg">
        <select-address v-model="userAddressId" />
        <select-logistics v-model="logistics.price" @change="logisticsChange" />
        <product-list :list="orderList" :logistics-price="logistics.price" />
      </b-overlay>
    </div>
    <b-navbar fixed="bottom" class="checkout">
      <b-container>
        <b-navbar-nav></b-navbar-nav>
        <b-navbar-nav align="right">
          <b-nav-text class="summarize">
            <span class="label">{{ $t("order.seller") }}</span>
            <span class="value">{{ newTempOrder.length }}</span>
            <span class="label">{{ $t("order.variety") }}</span>
            <span class="value">{{ variety }}</span>
            <span class="label">{{ $t("order.pieces") }}</span>
            <span class="value">{{ pieces }}</span>
            <span class="label">{{ $t("order.freight") }}</span>
            <span class="value">{{ totalFreight.toFixed(2) }}</span>
            <span class="label appear">{{ $t("order.totalAmount") }}</span>
            <span class="value appear">${{ totalAmount.toFixed(2) }}</span>
          </b-nav-text>
          <b-button
            class="paybtn"
            size="lg"
            squared
            v-loading="orderLoading"
            variant="danger"
            @click="addOrder"
          >
            {{ $t("order.placeOrder") }}
          </b-button>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
    <div class="bottom-space"></div>
  </b-container>
</template>
<script>
import ProductList from "@/components/ProductList";
import SelectAddress from "@/components/SelectAddress";
import SelectLogistics from "@/components/SelectLogistics";
import OrderSteps from "@/components/OrderSteps";
import { AddOrder } from "@/utils/api";

export default {
  components: {
    ProductList,
    SelectAddress,
    SelectLogistics,
    OrderSteps
  },
  data() {
    return {
      newTempOrder: [],
      logistics: {
        price: 0,
      },
      userAddressId: 0,
      orderLoading: false,
    };
  },
  computed: {
    orderList: function () {
      return this.newTempOrder;
    },
    variety: function () {
      return this.newTempOrder
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
      return this.newTempOrder
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
    productList: function () {
      return this.newTempOrder
        .map((seller) => {
          return seller.product
            .map((product) => {
              return product.list
                .map((color) => {
                  return color.specs.map((specs) => {
                    return {
                      productId: product.id,
                      specId: specs.specId,
                      pcs: specs.num,
                    };
                  });
                })
                .reduce((a, v) => a.concat(v), []);
            })
            .reduce((a, v) => a.concat(v), []);
        })
        .reduce((a, v) => a.concat(v), []);
    },
    totalAmount: function () {
      return (
        this.totalFreight +
        this.newTempOrder
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
          .reduce((a, v) => a + v.num * v.price, 0)
      );
    },
    totalFreight: function () {
      return (
        this.orderList.reduce((a, v) => a + v.cbm * this.logistics.price, 0) /
        100
      );
    },
  },
  created() {
    this.getNewTempOrder();
    // this.getCart();
  },
  methods: {
    logisticsChange(e) {
      this.logistics = {
        ...this.logistics,
        ...e,
      };
    },

    addOrder() {
      const data = {
        productList: this.productList,
        userAddressId: this.userAddressId,
        ...this.logistics,
      };
      delete data["price"];
      // console.log("addOrder-data:", data);
      this.orderLoading = true;
      AddOrder(data)
        .then((res) => {
          // console.log("addOrder-res:", res);
          this.orderLoading = false;
          this.$router.push({ name: 'checkoutPayment', query: {
            ids: res.data.map(v => v.id).join(','),
          }});
        })
        .catch((err) => {
          console.log("addOrder-err:", err);
          this.orderLoading = false;
          this.$bvToast.toast(`${err.errmsg}`, {
            toaster: "b-toaster-top-center",
            variant: "danger",
            appendToast: false,
            noCloseButton: true,
            autoHideDelay: 3000,
          });
        });
    },

    getNewTempOrder() {
      const newTempOrderJson = localStorage.getItem("newTempOrder");
      // console.log("newTempOrderJson:", newTempOrderJson);
      if (newTempOrderJson) {
        const newTempOrder = JSON.parse(newTempOrderJson);
        // console.log("newTempOrder:", newTempOrder);
        this.newTempOrder = newTempOrder;
      }
    },

    // getCart() {
    //   getCart({}).then((res) => {
    //     console.log(res);
    //     // this.list = res.data.rows;
    //     this.total = this.getTotalCapacity(res.data[0].productData);
    //   });
    // },
    getTotalCapacity(data) {
      let totalPrice = 0;
      // console.log("data:", data);
      if (data) {
        data.forEach((product) => {
          for (let car of product.cars) {
            for (let spec of car.specs) {
              // console.log("spec:", spec);
              totalPrice += spec.price * spec.num;
            }
          }
        });
      }
      return totalPrice;
    },
  },
};
</script>
<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;

.order {
  padding-top: 50px;
  &-steps {
    padding: 30px 0;
    justify-content: center;
  }

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
    height: 60px;
    width: 150px;
    background-color: #ef2e22;
    flex-shrink: 0;
  }
}
</style>