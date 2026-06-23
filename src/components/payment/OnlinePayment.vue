<template>
  <div class="online-pay">
    
    <div class="pay-row">
      <flutterwave ref="flutterwaveRef" :order-id-list="orderIdList" />
      <span> {{ $t("order.pay") }}&ensp;KES, NGN, GHS, USD, FCFA </span>
    </div>

    <div class="pay-row">
      <paystack ref="paystackRef" :order-id-list="orderIdList" />
      <span>{{ $t("order.pay") }}&ensp;GHS</span>
    </div>

    <div class="pay-row">
      <wechat-pay
        ref="wechatpayRef"
        :order-id-list="orderIdList"
        @onplaying="onPlaying"
      />
      <span>{{ $t("order.pay") }}&ensp;CNY</span>
    </div>

    <div class="pay-row">
      <alipay
        ref="alipayRef"
        :order-id-list="orderIdList"
        @onplaying="onPlaying"
      />
      <span>{{ $t("order.pay") }}&ensp;CNY</span>
    </div>

    <!-- <div class="pay-row">
      <cashenvoy-pay ref="cashenvoyRef" :order-id-list="orderIdList" />
      <span> {{ $t("order.pay") }}&ensp;NGN </span>
    </div> -->
    <!-- <div class="pay-row">
      <flutterwave-test ref="shareRef" :order-id-list="orderIdList" />
      <span>
        {{ $t("order.pay") }}&ensp;NGN, GHS, USD
      </span>
    </div> -->
    <!-- 暂时隐藏paydunyaRef支付feature -->
    <div class="pay-row" v-if="false">
      <paydunya ref="paydunyaRef" :order-id-list="orderIdList" />
      <span> {{ $t("order.pay") }}&ensp;FCFA </span>
    </div>
    <!-- <div class="pay-row">
      <sharepaybyothers ref="shareRef" :order-id-list="orderIdList" />
      <span>
        {{ $t("common.supportsallcurrencies") }}
      </span>
    </div> -->
    <!-- <div class="pay-row">
      <Stripe ref="stripeRef" :order-id-list="orderIdList" />
      <span> {{ $t("order.pay") }}&ensp;USD </span>
    </div> -->
  </div>
</template>

<script>
import Alipay from "./Alipay";
import WechatPay from "./WechatPay";
import Flutterwave from "./Flutterwave";
import Paystack from "./Paystack";
// import CashenvoyPay from "./CashenvoyPay.vue";
// import Sharepaybyothers from "./Sharepaybyothers.vue";
import Paydunya from "./Paydunya";
// Stripe and FlutterwaveTest — currently disabled.
export default {
  components: {
    Alipay,
    WechatPay,
    Flutterwave,
    Paystack,
    // CashenvoyPay,
    // Sharepaybyothers,
    Paydunya,
    // Stripe,
    // FlutterwaveTest,
  },
  props: {
    currency: {
      type: String,
      default: "",
    },
    orderIdList: {
      type: Array,
    },
  },
  methods: {
    onPlaying() {
      this.$refs["wechatpayRef"].abort();
      this.$refs["alipayRef"].abort();
      this.$refs["paystackRef"].abort();
      this.$refs["flutterwaveRef"].abort();
      // this.$refs["cashenvoyRef"].abort();
      this.$refs["paydunyaRef"].abort();
      this.$refs["stripeRef"].abort();
    },
  },
  updated() {
    window.onload = window.onresize = function () {
      document.getElementById("a").innerHTML =
        "屏幕尺寸为: 宽 " +
        window.screen.width +
        " x " +
        window.screen.height +
        "";
    };
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;
.online-pay {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .pay-row {
    width: 33%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    @include mobile {
      width: 100%;
    }
  }
}
/* 定义竖屏 css */
@media screen and (orientation: portrait) {
  .disabled {
    width: 60px;
    height: 60px;
  }
  .flutterwave {
    width: 60px;
    height: 60px;
  }
}
</style>