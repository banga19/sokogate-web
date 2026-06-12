<template>
  <div class="code-box">
    <el-input
      :value="value"
      @input="handleChange"
      :placeholder="$t('common.verificationCode')"
      class="send_code"
    >
    </el-input>

    <el-button
      v-if="sendCodeButtonStatus"
      class="send_code_btn"
      :loading="loading"
      @click.stop="sendCode"
      >{{ sendModileCodeResultText }}</el-button
    >
    <el-button v-else class="send_code_btn"
      >{{ count }}{{ sendCodeResultText }}</el-button
    >
  </div>
</template>


<script>
import { SmsSend } from "@/utils/api";
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      timer: null,
      count: 60,
      sendCodeButtonStatus: true,
      sendModileCodeResultText: this.$t("common.sendModileCodeResultText"),
      sendCodeResultText: this.$t("common.sendCodeResultText"),
      loading: false,
    };
  },
  methods: {
    handleChange(e) {
      // console.log("handleChange", e);
      this.$emit("input", e);
    },
    initTime() {
      this.sendCodeButtonStatus = false;
      this.timer = setInterval(() => {
        if (this.count > 0) {
          this.count--;
          this.sendCodeButtonStatus = false;
        } else {
          this.sendCodeButtonStatus = true;
          this.count = 60;
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },
    sendCode() {
      this.loading = true;
      const say = {
        receive: this.formData.receive,
      };
      SmsSend(say)
        .then((res) => {
          this.loading = false;
          this.initTime();
          console.log("AddVerifyCode-res", res);
          this.$message({
            showClose: false,
            message: this.$t("common.sendModileCodeTips"),
            type: "success",
          });
        })
        .catch((err) => {
          this.loading = false;
          console.log("AddVerifyCode-err", err);
          if (err.errcode === 2102) {
            this.$message({
              showClose: false,
              message: err.errmsg,
              type: "warning",
            });
          } else if (err.errcode === 1902) {
            this.$message({
              showClose: false,
              message: err.errmsg,
              type: "warning",
            });
          } else {
            this.$message({
              showClose: false,
              message: err.errmsg,
              type: "warning",
            });
          }
        });
    },
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss" scoped>
.code-box {
  display: flex;
  justify-content: space-between;
  .send_code_btn {
    background: #ef2e22;
    color: #fff;
    width: 180px !important;
    margin-top: 0px !important;
    margin-left: 5px !important;
    border: none;
    border-radius: 10px !important;
  }
}
</style>