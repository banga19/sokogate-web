<template>
  <div class="flutterwave-two">
    <el-image
      @click="getOrderPay"
      src="https://oss.sokogate.com/static/flutterwave_logo.jpeg"
      fit="contain"
    ></el-image>

    <el-dialog
      :modal-append-to-body="true"
      :append-to-body="true"
      :visible.sync="dialogTableVisible"
    >
      <section>
        <div class="formcontainer">
          <hr />
          <div class="container">
            <label for="currency">
              <strong> {{ $t("common.currency") }}</strong>
            </label>
            <input
              v-model="currency"
              type="text"
              :placeholder="$t('common.currency')"
              name="currency"
              required
            />
            <label for="uname">
              <strong>{{ $t("common.fullname") }}</strong>
            </label>
            <input
              v-model="uname"
              required
              type="text"
              :placeholder="$t('common.fullname')"
              name="uname"
            />

            <label for="email">
              <strong>{{ $t("common.email") }}</strong>
            </label>
            <input
              v-model="email"
              required
              type="text"
              :placeholder="$t('common.email')"
              name="email"
            />

            <label for="number">
              <strong>{{ $t("common.mobile") }}</strong>
            </label>
            <input
              v-model="number"
              type="text"
              :placeholder="$t('common.mobile')"
              name="number"
              required
            />

            <label for="amount">
              <strong>{{ $t("shoppingCart.total") }}</strong>
            </label>
            <input
              v-model="amount"
              type="number"
              :placeholder="$t('shoppingCart.total')"
              name="amount"
              required
            />

            <br />
            <br />

            <flutterwave-pay-button
              :tx_ref="generateReference()"
              :amount="amount"
              :currency="currency"
              :country="'NG'"
              :meta="{
                counsumer_id: this.$store.state.user.userId,
                consumer_mac: 'kjs9s8ss7dd',
              }"
              :customer="{ name: uname, email: email, phone_number: number }"
              :customizations="{
                title: 'Sokogate Enterprise',
                description: ' Paying for your Product ',
                logo: 'https://oss.sokogate.com/static/logo.jpg?x-oss-process=style/w128',
              }"
              :callback="makePaymentCallback"
              :onclose="closedPaymentModal"
            >
              {{ $t("account.payNow") }}
            </flutterwave-pay-button>
          </div>
        </div>
      </section>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      dialogTableVisible: false,
    };
  },
  computed: {
    // 限制的货币
    available() {
      return ["GHS", "NGN", "USD", "XOF"].includes(this.$store.state.currency);
    },
    // 总计
    amount: {
      get: function () {
        return this.$store.state.amount / 100;
      },
      set: function (v) {
        // console.log("v", v);
        return this.$store.commit("setamount", v * 100);
      },
    },
    // 姓名
    uname() {
      return this.$store.state.user.email;
    },
    // 邮箱
    email() {
      return this.$store.state.user.email;
    },
    // 手机号码
    number() {
      return this.$store.state.user.mobile;
    },
    // 货币
    currency: {
      get: function () {
        return this.$store.state.currency;
      },
      set: function (v) {
        return this.$store.commit("setCurrency", v);
      },
    },
    // 国家
    country() {
      return this.$store.state.countryName;
    },
  },
  methods: {
    getOrderPay() {
      if (!this.available) {
        this.dialogTableVisible = false;

        this.$utils
          .confirm({
            content:
              "FlutterWave" + " " + this.$t("order.pay") + " NGN、GHS、USD、XOF",
            okText: this.$t("order.changecurrency"),
          })
          .then((confirm) => {
            if (confirm) {
              this.$store.commit("setCurrency", "USD");
            }
          });
      } else {
        this.dialogTableVisible = true;
      }
    },
    makePaymentCallback(response) {
      console.log("Payment Successfull", response);
    },
    closedPaymentModal() {
      console.log("payment modal is closed");
    },
    generateReference() {
      let date = new Date();
      return date.getTime().toString();
    },
  },
};
</script>


<style lang="scss" scoped>
.flutterwave-two {
  border-radius: 10px;
  width: 196px;
  height: 150px;
  border: 1px solid #000;
  margin-right: 15px;
  margin-bottom: 15px;
  transition: 0.5s;
  display: flex;
  cursor: pointer;
  .el-dialog__body {
    .formcontainer {
      text-align: left;
      margin: 24px 50px 12px;
      .container {
        padding: 16px 0;
        text-align: left;
      }
    }
  }
}
html,
body {
  display: flex;
  justify-content: center;
  font-family: Roboto, Arial, sans-serif;
  font-size: 15px;
}

input {
  width: 100%;
  padding: 16px 8px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
button {
  background-color: #ef2e22;
  color: white;
  padding: 14px 0;
  margin: 10px 0;
  border: none;
  cursor: grabbing;
  width: 100%;
  &:hover {
    opacity: 0.8;
  }
}
</style>