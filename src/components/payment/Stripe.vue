<template>
  <div class="stripe" :class="{ disabled: !available }" @click="getOrderPay">
    <p class="title">Stripe</p>
    <el-dialog
      title="Stripe"
      :visible.sync="dialogVisible"
      :show-close="true"
      :append-to-body="true"
      :modal-append-to-body="true"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <stripe-element-payment
        ref="paymentRef"
        :pk="pk"
        :elements-options="elementsOptions"
        :confirm-params="confirmParams"
        @loading="(v) => (stripeLoading = v)"
      />
      <button @click="pay" class="pay-btn">Pay now!</button>
      <!-- <stripe-checkout
        ref="checkoutRef"
        mode="payment"
        :pk="publishableKey"
        :line-items="lineItems"
        :success-url="successURL"
        :cancel-url="cancelURL"
        @loading="(v) => (stripeLoading = v)"
      />
      <button @click="submit" class="pay-btn">Pay now!</button> -->
    </el-dialog>
  </div>
</template>

<script>
import { OrderPay, GetPayResult } from "@/utils/api";
import {
  StripeElementPayment,
  //   StripeCheckout,
} from "@vue-stripe/vue-stripe";
export default {
  components: {
    StripeElementPayment,
    // StripeCheckout,
  },
  props: {
    orderIdList: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      stripeLoading: false,
      payId: 0,
      expireAt: 0,
      expired: false,
      requestErrorTimes: 0,
      total: 0,
      publishableKey: "",
      lineItems: [
        {
          price: "", // The id of the one-time price you created in your Stripe dashboard
          quantity: 1,
        },
      ],
      successURL: "your-success-url",
      cancelURL: "your-cancel-url",
      pk: "",
      elementsOptions: {
        appearance: {}, // appearance options
      },
      confirmParams: {
        return_url: "", // success url
      },
    };
  },
  computed: {
    available() {
      return ["USD"].includes(this.$store.state.currency);
    },
    href() {
      return process.env.VUE_APP_V1_HOMEPAGE_URL + "v2/order";
      // 判断是正式环境, 开发环境还是测试环境
      // return process.env.VUE_APP_MODE === "development" ||
      //   process.env.VUE_APP_MODE === "test"
      //   ? "http://sokogate.lenneth.cn" + "/v2/order"
      //   : "HTTPS://sokogate.com" + "/v2/order";
    },
  },
  methods: {
    pay(e) {
      e.preventDefault();
      // this will trigger the process
      this.$refs.paymentRef.submit();
    },
    submit() {
      // You will be redirected to Stripe's secure checkout page
      this.$refs.checkoutRef.redirectToCheckout();
    },
    tokenCreated(token) {
      console.log(token);
      // handle the token
      // send it to your server
    },
    getOrderPay() {
      if (!this.payId && this.available) {
        this.$emit("onplaying");
        this.loading = true;
        OrderPay({
          idList: this.orderIdList,
          payMethod: 801,
          currency: this.$store.state.currency,
        })
          .then((res) => {
            // console.log("OrderPay-res:", res);
            this.dialogVisible = true;
            this.loading = false;
            this.expireAt = res.data.expireAt;
            this.payId = res.data.payId;
            this.total = res.data.total;
            this.confirmParams.return_url = this.href;
            this.pk = res.data.stripe.publicKey;
            // console.log(this.pk, "this.pk");
            // this.successURL = this.href;
            // this.lineItems.map((v) => (v.price = res.data.stripe.id));
            // console.log(this.lineItems, "lineItems",this.publishableKey);

            // console.log(res.data.stripe.publicKey, "publishableKey");
            this.elementsOptions.clientSecret = res.data.stripe.clientSecret;
            this.$nextTick(this.getPayResult());
          })
          .catch((err) => {
            console.log("OrderPay-err:", err);
            this.loading = false;
          });
      } else {
        this.$utils
          .confirm({
            content: "stripe" + " " + this.$t("order.pay") + "USD",
            okText: this.$t("order.changecurrency"),
          })
          .then((confirm) => {
            if (confirm) {
              this.$store.commit("setCurrency", "USD");
              this.$nextTick(() => {
                this.getOrderPay();
              });
            }
          });
      }
    },
    getPayResult() {
      const nowUnix = Math.round(new Date().getTime() / 1000);
      if (this.$route.path !== "/v2/checkout/payment") {
        // 不在本页, 中止轮询
        // console.log("this.$route.path changed:", this.$route.path);
        return false;
      } else if (this.requestErrorTimes > 10) {
        // request错误attempts到达上限, 中止轮询
        // console.log("request error times maximum:", this.requestErrorTimes);
        return false;
      } else if (!this.dialogVisible) {
        // 手动中止
        return false;
      } else if (this.expireAt - nowUnix > 60) {
        GetPayResult({ id: this.payId })
          .then((res) => {
            // console.log("GetPayResult-res:", res);
            this.requestErrorTimes = 0;
            if (res.data.status === 101) {
              // 待支付, 继续轮询支付状态
              setTimeout(() => this.getPayResult(), 2500);
            } else {
              this.$message({
                showClose: false,
                message: "pay status: " + res.data.status,
                type: "error",
              });
              this.dialogVisible = false;
              this.$utils.redirecto("/v2/order");
            }
          })
          .catch((err) => {
            console.log("GetPayResult-err:", err);
            this.requestErrorTimes++;
          });
      } else {
        // 支付超时, 中止轮询
        // console.log("pay qcode is expired - payId:", this.payId);
        this.expired = true;
        return false;
      }
    },
    abort() {
      this.loading = false;
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
.stripe {
  border-radius: 10px;
  width: 120px;
  height: 120px;
  border: 1px solid #000;
  margin-right: 15px;
  margin-bottom: 15px;
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    background-color: rgba($color: #1677ff, $alpha: 0.3);
    border: 1px solid #1677ff;
  }

  .sokogate {
    color: #1677ff;
    font-size: 60px;
    margin-right: 10px;
  }

  .title {
    font-size: 25px;
  }

  // &.disabled {
  //   border: 1px solid #888;

  //   .title,
  //   .sokogate {
  //     color: #888;
  //   }
  // }
}
.pay-btn {
  border: 0;
  margin-top: 24px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  transition: all 0.2s ease;
  width: 100%;
  background: rgb(5, 112, 222);
  border-radius: 5px;
  color: white;
}
</style>