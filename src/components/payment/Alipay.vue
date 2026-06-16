<template>
  <div class="alipay" :class="{ disabled: !available }" @click="getOrderPay">
    <i class="sokogate icon-alipay" />
    <p class="title">支付宝</p>
    <el-dialog
      :title="$t('order.alipay')"
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
        <sui-product-price :value="total" size="m" form="CNY" to="CNY" />
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
          payMethod: 301,
          currency: this.$store.state.currency,
        })
          .then((res) => {
            // console.log("OrderPay-res:", res);
            this.dialogVisible = true;
            this.loading = false;
            this.expireAt = res.data.expireAt;
            this.payId = res.data.payId;
            this.total = res.data.total;
            this.jumpAlipay = res.data.payReturn;
            window.open(this.jumpAlipay, "_blank");
            this.$nextTick(this.getPayResult());
          })
          .catch((err) => {
            console.log("OrderPay-err:", err);
            this.loading = false;
          });
      } else {
        this.$utils
          .confirm({
            content: this.$t("order.alipay") + " " + this.$t("order.pay") + " CNY",
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
    }
  },
};
</script>

<style lang="scss">
.alipay {
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
  /* 定义竖屏 css */
@media screen and (orientation: portrait) {
  .title{
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