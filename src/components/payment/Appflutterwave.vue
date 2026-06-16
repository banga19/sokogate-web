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
      v-loading.fullscreen.lock="fullscreenLoading"
    ></div>
  </template>
  
  <script>
  // import { FlutterwavePayButton } from "flutterwave-vue-v3";
  import { OrderPay } from "@/utils/api";
  
  export default {
    props: {
      orderIdList: {
        type: Array,
      },
    },
    components: {
    //   FlutterwavePayButton,
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
        email:'',
        phone_number:'',
        idList:'',
        currency:'',
        fullscreenLoading: false,
      };
    },
    mounted(){
        console.log(this.$route.query);
        localStorage.setItem("auth_token",this.$route.query.header)
        this.email = this.$route.query.email;
        this.phone_number = this.$route.query.phone_number;
        this.idList = Number(this.$route.query.idList)
        this.currency = this.$route.query.currency
        this.getOrderPay()
    },
    computed: {
      available() {
        return ["KES","GHS", "NGN", "USD", "XOF"].includes(this.$store.state.currency);
      },
      paymentData() {
        return {
          tx_ref: this.outTradeNo,
          amount: this.total / 100,
          currency: this.$route.query.currency,
          country: this.$store.state.currency.slice(
            0,
            this.$store.state.currency.length - 1
          ),
          redirect_url: "",
          meta: {
            counsumer_id: "64ebfa81effbb1fb24d2d4cc",
            consumer_mac: "1572",
          },
          customer: {
            name: this.email,
            email: this.email,
            phone_number: this.phone_number,
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
        this.fullscreenLoading = true;
        if (!this.payId && this.available) {
          this.$emit("onplaying");
          this.loading = true;
          OrderPay({
            idList: [this.idList],
            payMethod: 501,
            currency: this.currency,
          })
            .then((res) => {
            this.fullscreenLoading = false;
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
                this.fullscreenLoading = false;
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
      makePaymentCallback(response) {
        console.log("Payment callback", response);
        this.loading = false;
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