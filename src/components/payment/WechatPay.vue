<template>
  <div
    class="wechat-pay"
    v-loading="loading"
    :class="{ activated: hasBeenActivated, disabled: !available }"
    @click="getOrderPay"
  >
    <div class="wechat-pay-hd" v-if="total > 0 && hasBeenActivated">
      <sui-product-price
        :value="total"
        size="m"
        color="#fff"
        form="CNY"
        to="CNY"
      />
    </div>
    <div class="wechat-pay-bd" v-if="hasBeenActivated">
      <div class="qrcode" id="qrcode" ref="qrCodeUrl"></div>
    </div>
    <i class="sokogate icon-wechat-pay" />
    <div class="wechat-pay-ft">
      微信支付
    </div>
  </div>
</template>

<script>
import SuiProductPrice from "@/components/product/Price";
import { OrderPay, GetPayResult } from "@/utils/api";
import QRCode from "qrcodejs2";

export default {
  components: { SuiProductPrice },
  props: {
    orderIdList: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      hasBeenActivated: false,
      payId: 0,
      expireAt: 0,
      expired: false,
      requestErrorTimes: 0,
      total: 0,
    };
  },
  computed: {
    available() {
      return ["CNY"].includes(this.$store.state.currency);
    },
  },
  methods: {
    getOrderPay() {
      if (!this.payId && this.available) {
        this.$emit("onplaying");
        this.loading = true;
        OrderPay({
          idList: this.orderIdList,
          payMethod: 201,
          currency: this.$store.state.currency,
        })
          .then((res) => {
            // console.log("OrderPay-res:", res);
            this.hasBeenActivated = true;
            this.$nextTick(() => {
              const qrcode = new QRCode(this.$refs.qrCodeUrl, {
                text: res.data.payReturn, // 需要转换为二维码的内容
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
              });
              this.loading = false;
              this.expireAt = res.data.expireAt;
              this.payId = res.data.payId;
              this.total = res.data.total;
              this.$nextTick(this.getPayResult());
              console.log("qrcode:", qrcode);
            });
          })
          .catch((err) => {
            console.log("OrderPay-err:", err);
            this.loading = false;
          });
      } else {
        this.$utils
          .confirm({
            content: this.$t("order.wechatpay") + " " + this.$t("order.pay") + " CNY",
            okText: this.$t("order.changecurrency"),
          })
          .then((confirm) => {
            if (confirm) {
              this.$store.commit("setCurrency", "CNY");
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
        // 不在本页，中止轮询
        // console.log("this.$route.path changed:", this.$route.path);
        return false;
      } else if (this.requestErrorTimes > 10) {
        // 请求错误次数到达上限，中止轮询
        // console.log("request error times maximum:", this.requestErrorTimes);
        return false;
      } else if (!this.hasBeenActivated) {
        // 手动中止
        return false;
      } else if (this.expireAt - nowUnix > 60) {
        GetPayResult({ id: this.payId })
          .then((res) => {
            // console.log("GetPayResult-res:", res);
            this.requestErrorTimes = 0;
            if (res.data.status === 101) {
              // 待支付，继续轮询支付状态
              setTimeout(() => this.getPayResult(), 2500);
            } else {
              this.$message({
                showClose: false,
                message: "pay status: " + res.data.status,
                type: "error",
              });
              this.$utils.redirecto("/v2/order");
            }
          })
          .catch((err) => {
            console.log("GetPayResult-err:", err);
            this.requestErrorTimes++;
          });
      } else {
        // 支付超时，中止轮询
        // console.log("pay qcode is expired - payId:", this.payId);
        this.expired = true;
        return false;
      }
    },
    abort() {
      this.loading = false;
      this.hasBeenActivated = false;
    }
  },
};
</script>

<style lang="scss">
.wechat-pay {
  border-radius: 10px;
  width: 120px;
  height: 120px;
  border: 1px solid #000;
  margin-right: 15px;
  margin-bottom: 15px;
  transition: 0.5s;
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: rgba($color: #22ac38, $alpha: 0.3);
    border: 1px solid #22ac38;
  }

  &.activated {
    width: 290px;
    border: 1px solid #22ac38;
    background-color: #22ac38;
    display: flex;
    flex-direction: column;
    height: 400px;
    .wechat-pay-ft {
      background-color: #fff;
      flex-direction: row;
      height: 90px;
    }
  }

  &-hd {
    margin-top: 19px;
    text-align: center;
  }

  &-bd {
    display: block;
    margin: 19px auto;
    flex-grow: 1;

    .qrcode {
      background-color: #fff;
      padding: 10px;
    }
  }

  &-ft {
    width: 100%;
    background-color: transparent;
    border-bottom-left-radius: 10px;
    border-end-end-radius: 10px;
    min-height: 55px;
    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  .sokogate {
      color: #22ac38;
      font-size: 60px;
      margin-right: 10px;
    }
  /*定义竖屏 css*/
  @media screen and (orientation: portrait) {
    .wechat-pay-ft {
      display: none;
    }
}
  // &.disabled {
  //   border: 1px solid #888;

  //   .title,
  //   .sokogate {
  //     color: #888;
  //   }
  // }
}
</style>