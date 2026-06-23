<template>
  <div class="paystack" v-loading="loading">
    <el-image
      @click="getOrderPay"
      src="https://oss.sokogate.com/static/paystack.jpg"
      fit="contain"
    ></el-image>
  </div>
</template>

<script>
import PaystackPop from "@paystack/inline-js";
import { OrderPay } from "@/utils/api";

export default {
  props: {
    orderIdList: {
      type: Array,
    },
  },    data() {
    return {
      loading: false,
      total: 0,
      outTradeNo: "",
    };
  },
  computed: {
    available() {
      return ["GHS"].includes(this.$store.state.currency);
    },
    paystackPublicKey() {
      return process.env.VUE_APP_V2_PAYSTACK_PUBLICKEY || "";
    },
  },
  methods: {
    getOrderPay() {
      if (this.available) {
        this.$emit("onplaying");
        this.loading = true;
        OrderPay({
          idList: this.orderIdList,
          payMethod: 401,
          currency: this.$store.state.currency,
        })
          .then((res) => {
            this.total = res.data.total;
            this.outTradeNo = res.data.outTradeNo;
            this.$nextTick(() => {
              this.payWithPaystack();
            });
          })
          .catch((err) => {
            console.log("OrderPay-err:", err);
            this.loading = false;
          });
      } else {
        this.$utils
          .confirm({
            content: "PayStack" + " " + this.$t("order.pay") + " GHS",
            okText: this.$t("order.changecurrency"),
          })
          .then((confirm) => {
            if (confirm) {
              this.$store.commit("setCurrency", "GHS");
              this.$nextTick(() => {
                this.getOrderPay();
              });
            }
          });
      }
    },
    payWithPaystack() {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: this.paystackPublicKey,
        email: this.$store.state.user?.email || "",
        amount: this.total,
        currency: "GHS",
        ref: this.outTradeNo,
        callback: (response) => {
          this.makePaymentCallback(response);
        },
        onClose: () => {
          this.closedPaymentModal();
        },
        onCancel: () => {
          this.loading = false;
        },
      });
    },
    makePaymentCallback(response) {
      console.log("Paystack payment callback", response);
      this.loading = false;

      this.$message.success(this.$t("payment.Payment successful"));
      setTimeout(() => {
        this.$router.push({
          path: "/v2/checkout/paymentSuccess",
          query: {
            id: this.orderIdList?.[0],
            paymentMethod: "paystack",
          },
        });
      }, 1000);
    },
    closedPaymentModal() {
      console.log("Paystack payment modal closed");
      this.loading = false;
    },
    abort() {
      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
.paystack {
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
    background-color: rgba($color: #ff9b00, $alpha: 0.3);
    border: 1px solid #ff9b00;
  }
}
</style>
