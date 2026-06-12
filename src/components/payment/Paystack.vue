<template>
  <div class="paystack" :class="{ disabled: !available }" v-loading="loading">
    <el-image
      @click="getOrderPay"
      src="https://oss.sokogate.com/static/paystack.jpg"
      fit="contain"
    ></el-image>
  </div>
</template>

<script>
import { OrderPay } from "@/utils/api";
// import PaystackPop from "@paystack/inline-js";

export default {
  props: {
    orderIdList: {
      type: Array,
    },
  },
  // components: {
  //   paystack
  // },
  data() {
    return {
      loading: false,
    };
  },
  // created() {
  //   const popup = document.createElement("script");
  //   popup.setAttribute("src", "https://js.paystack.co/v2/inline.js");
  //   popup.async = true;
  //   document.head.appendChild(popup);
  // },
  computed: {
    available() {
      return ["GHS"].includes(this.$store.state.currency);
    },
  },
  methods: {
    getOrderPay() {
      // const paystack = new PaystackPop();
      // paystack.newTransaction({
      //   key: "pk_test_7111cdf83f4438328b6b7ef03870cb614c923dab",
      //   email: this.$store.state.user.email,
      //   amount: 311,
      //   currency: "GHS",
      //   ref: "ref" + this.generateReference(),
      //   callback: function (response) {
      //     //this happens after the payment is completed successfully
      //     var reference = response.reference;
      //     alert("Payment complete! Reference: " + reference);
      //     // Make an AJAX call to your server with the reference to verify the transaction
      //   },
      //   onClose: function () {
      //     alert("Transaction was not completed, window closed.");
      //   },
      //   onSuccess: (transaction) => {
      //     console.log("onSuccess-transaction:", transaction);
      //   },
      //   onCancel: (res) => {
      //     console.log("onCancel-res:", res);
      //   },
      // });
      if (!this.payId && this.available) {
        this.$emit("onplaying");
        this.loading = true;
        OrderPay({
          idList: this.orderIdList,
          payMethod: 401,
          currency: this.$store.state.currency,
        })
          .then((res) => {
            // console.log("OrderPay-res:", res);
            this.hasBeenActivated = true;
            this.$nextTick(() => {
              // const paystack = new PaystackPop();
              // console.log(paystack.resumeTransaction(res.data.payReturn));
              // .then(popRes => {
              //   console.log('popRes:', popRes);
              // }).catch(popErr => {
              //   console.log('popErr:', popErr);
              // });
              window.open(res.data.payReturn, "_blank");
              this.loading = false;
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
    generateReference() {
      let date = new Date();
      return date.getTime().toString();
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