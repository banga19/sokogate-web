<template>
  <div
    class="sharepaybyothers-pay"
    :class="{ activated: hasBeenActivated }"
    @click="getOrderPay"
  >
    <div class="sharepaybyothers-pay-ft">
      <i class="sokogate icon-money-" />
      {{ $t("common.sharepaybyothers") }}
    </div>

    <el-dialog
      :title="$t('common.sharepaybyothers')"
      :visible.sync="codeDialogVisible"
      :modal-append-to-body="true"
      :append-to-body="true"
      width="500px"
      center
    >
      <div
        ref="qrCodeUrl"
        style="width: 200px; height: 200px; margin-top: 10px; margin-left: 25%"
      ></div>
      <el-input :value="href" style="margin-top: 10px"></el-input>
    </el-dialog>
  </div>
</template>

<script>
import { GetPayResult } from "@/utils/api";
import QRCode from "qrcodejs2";

export default {
  props: {
    orderIdList: {
      type: Array,
    },
  },
  data() {
    return {
      codeDialogVisible: false,
      hasBeenActivated: false,
      payId: 0,
      expireAt: 0,
      expired: false,
      requestErrorTimes: 0,
      qrcode: null,
    };
  },
  computed: {
    href() {
      return (
        process.env.VUE_APP_V1_HOMEPAGE_URL + this.$route.fullPath.slice(1)
      );
      // 判断是正式环境, 开发环境还是测试环境
      // return process.env.VUE_APP_MODE === "development" ||
      //   process.env.VUE_APP_MODE === "test"
      //   ? "http://sokogate.lenneth.cn" + this.$route.fullPath
      //   : "HTTPS://www.sokogate.com" + this.$route.fullPath;
    },
  },
  methods: {
    getOrderPay() {
      this.codeDialogVisible = true;
      if (this.qrcode != null) {
        this.qrcode.clear(); // 清除代码
      } else {
        this.$nextTick(() => {
          this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: this.href, // 需要转换为二维码的内容
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });
        });
        // this.$nextTick(this.getPayResult());
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
      } else if (!this.hasBeenActivated) {
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
  },
};
</script>

<style lang="scss">
.sharepaybyothers-pay {
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
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;

    .sokogate {
      color: #22ac38;
      font-size: 60px;
      margin-right: 10px;
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