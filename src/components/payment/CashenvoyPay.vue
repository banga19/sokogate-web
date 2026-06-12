<template>
  <div class="cashenvoy" :class="{ disabled: !available }" @click="getOrderPay">
    <el-image
      src="https://oss.sokogate.com/static/cashenvoy_logo.png"
      fit="contain"
    ></el-image>
    <el-dialog
      :title="$t('order.cashenvoy')"
      :visible.sync="dialogVisible"
      :show-close="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <!-- :before-close="handleClose" -->
      <p>
        {{ $t("order.amounts") }}
        <sui-product-price :value="total" size="m" form="NGN" to="NGN" />
      </p>
      <el-link :href="jumpAlipay" type="primary" target="_blank">
        {{ $t("order.clickhere") }}
      </el-link>
      {{ $t("order.opennewpage") }}
      <p>{{ $t("order.paymentcompleted") }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t("order.paymentfailed") }}
        </el-button>
        <el-button type="primary" @click="dialogVisible = false">
          {{ $t("order.paymentsuccessful") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SuiProductPrice from "@/components/product/Price";
import { OrderPay, GetPayResult } from "@/utils/api";

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
      dialogVisible: false,
      payId: 0,
      expireAt: 0,
      expired: false,
      requestErrorTimes: 0,
      total: 0,
      jumpAlipay: "",
    };
  },
  computed: {
    available() {
      return ["NGN"].includes(this.$store.state.currency);
    },
  },
  methods: {
    getOrderPay() {
      if (!this.payId && this.available) {
        this.$emit("onplaying");
        this.loading = true;
        OrderPay({
          idList: this.orderIdList,
          payMethod: 601,
          currency: this.$store.state.currency,
        })
          .then((res) => {
            // console.log("OrderPay-res:", res);
            this.dialogVisible = true;
            this.loading = false;
            this.expireAt = res.data.expireAt;
            this.payId = res.data.payId;
            this.total = res.data.total;
            this.jumpAlipay = res.data.cashenvoy.reqUrl;
            const ce_amount = res.data.cashenvoy.ceamt;
            const ce_customerid = res.data.cashenvoy.cecustomerid;
            const ce_memo = res.data.cashenvoy.cememo;
            const ce_merchantid = res.data.cashenvoy.cemertid;
            const ce_transref = res.data.cashenvoy.cetxref;
            const ce_notifyurl = res.data.cashenvoy.cenurl;
            const ce_ipnurl = res.data.cashenvoy.ipnurl;
            const ce_signature = res.data.cashenvoy.signature;
            const ce_window = "parent";
            // window.open(this.jumpAlipay, "_blank");
            var params = {
              ce_amount,
              ce_customerid,
              ce_memo,
              ce_merchantid,
              ce_transref,
              ce_notifyurl,
              ce_ipnurl,
              ce_signature,
              ce_window,
            };
            console.log(params, "params");
            this.openPostWindow(this.jumpAlipay, params);
            this.$nextTick(this.getPayResult());
          })
          .catch((err) => {
            console.log("OrderPay-err:", err);
            this.loading = false;
          });
      } else {
        this.$utils
          .confirm({
            content:
              this.$t("order.cashenvoy") + " " + this.$t("order.pay") + " NGN",
            okText: this.$t("order.changecurrency"),
          })
          .then((confirm) => {
            if (confirm) {
              this.$store.commit("setCurrency", "NGN");
              this.$nextTick(() => {
                this.getOrderPay();
              });
            }
          });
      }
    },
    openPostWindow(url, params) {
      var tempForm = document.createElement("form");
      tempForm.id = "tempForm1";
      tempForm.method = "post";
      tempForm.action = url;
      tempForm.target = "_blank"; //打开新页面

      for (var key in params) {
        tempForm.appendChild(this.generateInput(key, params));
      }
      if (document.all) {
        tempForm.attachEvent("onsubmit", function () {}); //IE
      } else {
        var subObj = tempForm.addEventListener("submit", function () {}, false); //firefox
        console.log("subObj", subObj);
      }
      document.body.appendChild(tempForm);
      if (document.all) {
        tempForm.fireEvent("onsubmit");
      } else {
        tempForm.dispatchEvent(new Event("submit"));
      }
      tempForm.submit();
      document.body.removeChild(tempForm);
    },

    generateInput(key, params) {
      var hideInput = document.createElement("input");
      hideInput.type = "hidden";
      hideInput.name = key;
      hideInput.value = params[key];
      return hideInput;
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
      } else if (!this.dialogVisible) {
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
              this.dialogVisible = false;
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
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
.cashenvoy {
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
    background-color: rgba($color: #660066, $alpha: 0.3);
    border: 1px solid #660066;
  }
}
</style>