<template>
    <!-- <flutterwave-pay-button
      :tx_ref="generateReference()"
      :amount="136"
      currency="NGN"
      payment_options="card,ussd"
      redirect_url=""
      class="class-name"
      style=""
      :meta="{ counsumer_id: '7898', consumer_mac: 'kjs9s8ss7dd' }"
      :customer="{
        name: 'Demo Customer  Name',
        email: 'user136@gmail.com',
        phone_number: '0818450****',
      }"
      :customizations="{
        title: 'Sokogate.com',
        description: 'Payment test for items in cart',
        logo: 'https://oss.sokogate.com/static/logo.jpg?x-oss-process=style/w128',
      }"
      :callback="makePaymentCallback"
      :onclose="closedPaymentModal"
    >
      <el-image
        src="http://oss.sokogate.com/static/flutterwave_logo.jpeg"
      ></el-image>
    </flutterwave-pay-button> -->
    <div
      class="flutterwave"
      :class="{ disabled: !available }"
      v-loading="loading"
    >
      <el-image
        @click="getOrderPay"
        src="https://oss.sokogate.com/static/flutterwave.jpg"
        fit="contain"
        class="flutterwave-img"
      ></el-image>
    </div>
  </template>
  
  <script>
  // import { FlutterwavePayButton } from "flutterwave-vue-v3";
  import { OrderPay, verifyFlutterwavePayment } from "@/utils/api";
  
  export default {
    props: {
      orderIdList: {
        type: Array,
      },
    },
    components: {
      // FlutterwavePayButton,
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
        outTradeNo: 0,
      };
    },
    computed: {
      available() {
        return ["KES","GHS", "NGN", "USD", "XOF"].includes(this.$store.state.currency);
      },
      paymentData() {
        return {
          tx_ref: this.outTradeNo,
          amount: this.total / 100,
          currency: this.$store.state.currency,
          country: this.$store.state.currency.slice(
            0,
            this.$store.state.currency.length - 1
          ),
          redirect_url: "",
          meta: {
            counsumer_id: this.$store.state.user.userId,
            consumer_mac: this.orderIdList.toString(),
          },
          customer: {
            name: this.$store.state.user.email,
            email: this.$store.state.user.email,
            phone_number: this.$store.state.user.mobile,
          },
          customizations: {
            title: "Sokogate.com",
            description: "Payment",
            logo: "https://oss.sokogate.com/static/logo.jpg?x-oss-process=style/w128",
          },
          callback: this.makePaymentCallback,
          onclose: this.closedPaymentModal,
        };
      },
    },
    methods: {
      getOrderPay() {
        if (!this.payId && this.available) {
          this.$emit("onplaying");
          this.loading = true;
          OrderPay({
            idList: this.orderIdList,
            payMethod: 501,
            currency: this.$store.state.currency,
          })
            .then((res) => {
              console.log("OrderPay-res:", res);
              this.hasBeenActivated = true;
              this.total = res.data.total;
              this.outTradeNo = res.data.outTradeNo;
              this.$nextTick(() => {
                console.log("this.paymentData:", this.paymentData);
                this.payWithFlutterwave(this.paymentData);
              });
            })
            .catch((err) => {
              console.log("OrderPay-err:", err);
              this.loading = false;
            });
        } else {
          this.$utils
            .confirm({
              content:
                "FlutterWave" +
                " " +
                this.$t("order.pay") +
                "KES, NGN, GHS, USD, FCFA",
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
      async makePaymentCallback(response) {
        console.log("Payment callback", response);
        this.loading = false;

        // Verify the transaction with our backend (server-to-server verification)
        if (response && response.transaction_id) {
          try {
            await verifyFlutterwavePayment({
              transaction_id: response.transaction_id,
              tx_ref: this.outTradeNo,
            });
            this.$message.success(this.$t('payment.Payment successful'));
            // Redirect to success page
            setTimeout(() => {
              this.$router.push({
                path: '/v2/checkout/paymentSuccess',
                query: {
                  id: this.orderIdList?.[0],
                  paymentMethod: 'flutterwave',
                },
              });
            }, 1000);
          } catch (err) {
            console.error('Flutterwave verification failed:', err);
            this.$message.error(
              err.errmsg || this.$t('payment.Payment verification failed')
            );
          }
        }
      },
      closedPaymentModal() {
        console.log("payment modal is closed");
        this.loading = false;
      },
      abort() {
        this.loading = false;
      },
    },
  };
  </script>
  
  <style lang="scss">
  .flutterwave {
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
    &-img {
      width: 147px;
    }
  
    // &.disabled {
    //   border: 1px solid #888;
  
    //   .title,
    //   .sokogate {
    //     color: #888;
    //   }
  
    //   .el-image {
    //     filter: grayscale(100%);
    //   }
    // }
  }
  </style>