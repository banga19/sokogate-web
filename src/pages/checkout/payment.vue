<template>
  <b-container class="order" >
    <div v-title :data-title="$t('order.chechout')">
      <order-steps :active="1" />
      <b-overlay
        id="overlay-background"
        :show="total === 0"
        :variant="variant"
        :opacity="opacity"
        :blur="blur"
        rounded="sm"
      >
        <b-jumbotron
          fluid
          :container-fluid="true"
          :header="$t('offinepayment.payment')"
          :lead="$t('offinepayment.choosePayment')"
        >
          <p >
            {{ $t("order.amounts") }}
            <sui-product-price :value="total" size="l" :form="currencyTo" />
            , {{ $t("order.payother") }}
            <el-button
              type="text"
              @click="$store.commit('setCurrencyDialogVisible', true)"
            >
              {{ $t("order.changecurrency") }}
            </el-button>
          </p>
          <template v-if="total > 0">
            <el-tabs value="online" >
              <el-tab-pane :label="$t('order.onlinepayment')" name="online">
                <online-payment
                  :currency="currencyTo"
                  :order-id-list="orderIdList"
                />
                <!-- <temp-pay-ment :order-id-list="orderIdList" /> -->
                <!-- {{ orderIdList }} -->
                <!-- <pay-ment :amount="total" /> -->
              </el-tab-pane>
              <el-tab-pane :label="$t('order.offlinepayment')" name="offline" >
                <offline-payment
                  :amount="`${total}`"
                  :order-id-list="orderIdList"
                  :attach="orderAttachList"
                  @onFinish="getList"
                  
                />
              </el-tab-pane>
            </el-tabs>

            <!-- <span>If there is no jump after payment, please</span>
            <b-button variant="link" href="#">Click here</b-button> -->
          </template>
        </b-jumbotron>
      </b-overlay>
    </div>
    <div class="bottom-space"></div>
  </b-container>
</template>
<script>
// import PayMent from "@/components/PayMent";
// import TempPayMent from "@/components/TempPayMent";
import OrderSteps from "@/components/OrderSteps";
import OfflinePayment from "@/components/OfflinePayment";
import SuiProductPrice from "@/components/product/Price";
import OnlinePayment from "@/components/payment/OnlinePayment";
// import { debounce } from "@/utils";
import { GetOrderListbyIds } from "@/utils/api";

export default {
  props: {
    erMap: {
      type: Object,
    },
  },
  components: {
    // PayMent,
    OrderSteps,
    // TempPayMent,
    OfflinePayment,
    SuiProductPrice,
    OnlinePayment,
  },
  data() {
    return {
      currencyTo: "",
      total: 0,
      variant: "light",
      opacity: 0.85,
      blur: "2px",
      orderList: [],
      orderIdList: [],
      orderAttachList: [],
      ids: "",
    };
  },
  // watch: {
  //   "$route.query": function (newVal, oldVal) {
  //     if (
  //       newVal.ids !== oldVal.ids &&
  //       newVal.ids !== this.ids &&
  //       this.$route.path === "/v2/checkout/payment"
  //     ) {
  //       console.log("watch");
  //       debounce(this.getList(true));
  //     }
  //   },
  // },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const { ids } = this.$route.query;
      const idArray = ids.split(",");
      // console.log("ids:", ids);
      this.ids = ids;
      this.orderIdList = idArray.map((v) => Number(v));
      GetOrderListbyIds({
        orderIdList: this.orderIdList,
      })
        .then((res) => {
          // console.log("getOrder-res:", res);
          this.orderList = res.data.rows;
          this.total = res.data.rows.reduce((a, v) => a + v.total, 0);
          this.$store.commit("setamount",this.total)
          this.currencyTo = res.data.rows[0].orderList[0].currencyTo;
          this.orderAttachList = res.data.rows[0].orderAttachList;
          // console.log(this.orderAttachList, "orderAttachList");
          // this.$store.commit(
          //   "cartCountMinus",
          //   res.data.rows.length > 0 ? res.data.rows.length : 0
          // );
        })
        .catch((err) => {
          console.log("getOrder-err:", err);
        });
    },
  },
};
</script>
<style lang="scss">
@use "@/style/_responsive.scss" as *;

.order {
  padding-top: 50px;
  .jumbotron {
    background: #fff;
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