<template>
  <b-container class>
    <b-row
      align-v="start"
      align-h="start"
      align-content="center"
      class="text-center"
      cols-md="6"
    >
      <!-- <b-col>
        <PayPal
          :amount="`${amount}`"
          currency="USD"
          :client="credentials"
          :env="env"
          @payment-authorized="paymentAuthorized"
          @payment-completed="paymentCompleted"
          @payment-cancelled="paymentCancelled"
        ></PayPal>
      </b-col>
      <b-col>
        <klasha
          :is-test-mode="isTestMode"
          :email="email"
          :phone-number="phoneNumber"
          :merchant-key="merchantKey"
          :amount="amount"
          :source-currency="sourceCurrency"
          :destination-currency="destinationCurrency"
          :tx-ref="txRef"
          :business-id="businessId"
          :fullname="fullname"
          :payment-type="paymentType"
          :payment-description="paymentDescription"
          :call-back="callBack"
          :on-close="onClose"
          :embed="false"
        >
          <i class="fas fa-money-bill-alt"></i>
          Klasha Payment
        </klasha>
      </b-col> -->
    </b-row>
  </b-container>
</template>

<script>
// PayPal and Klasha — currently disabled. Enable by installing the respective packages.
export default {
  components: {
    OfflinePayment,
  },
  props: {
    type: {
      require: true,
      type: String,
    },
    amount: {
      type: Number,
      value: 1,
    },
  },
  data() {
    return {
      isTestMode: true,
      email: "balde@sokogate.com",
      phoneNumber: "8618813759438",
      merchantKey:
        "fDczTDhWy78YH8dZx0gk6AX+Fin9DaRLmNYPu+TwUtCYWCL1gQ1flFxunxBBJJUQ",
      sourceCurrency: "USD" || "NGN",
      destinationCurrency: "USD" || "NGN",
      txRef: "" + this.makeId(16),
      businessId: "S-27601365",
      fullname: "some fullname",
      paymentDescription: "",
      paymentType: "",

      credentials: {
        sandbox:
          "AdcatzzajMwGM8zEEZIn4zY_mzZDCHAnIkS2Cp3u5iTpLRhPdlaaqkKUeWAkshI7hHDlKvXum7gXT0Qj",
        production:
          "AYBpfhgZv2zJJFie15NHWvpD_wa-q2pihKId0qw4TNEU7GZFRlnO9NifPolw8hhcJopDFVD0y7qFLe13",
      },
      env: "sandbox",
    };
  },
  created() {
    if (process.env.NODE_ENV === "production") {
      this.env = "production";
      this.isTestMode = false;
    } else {
      this.env = "sandbox";
      this.isTestMode = true;
    }
  },
  methods: {
    paymentAuthorized(e) {
      console.log("paymentAuthorized:", e);
    },
    paymentCompleted(e) {
      console.log("paymentCompleted:", e);
    },
    paymentCancelled(e) {
      console.log("paymentCancelled:", e);
    },
    makeId(length) {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    callBack(response) {
      console.log("callBack-response:", response);
    },
    onClose(response) {
      console.log("onClose-response:", response);
    },
  },
};
</script>

<style lang="scss" scoped>
.klashaPayButtonStyle {
  background-color: #4caf50;
  border-radius: 20px;
  height: 40px;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border: none;
  padding: 0 15px;
  margin: 15px 0;
}
.paypal-button {
  margin: 10px 0;
}
</style>
