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
      :loading="loading"
      class="send_code_btn"
      @click.stop="sendCode"
      >{{ $t("common.sendModileCodeResultText") }}</el-button
    >
    <el-button v-else class="send_code_btn"
      >{{ count }}{{ $t("common.sendCodeResultText") }}</el-button
    >
  </div>
</template>


<script>
import { AddVerifyCodeV2 } from "@/utils/api";
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
        codeType: 3,
        userType: 2,
        cond: this.formData.cond,
        tType: 2,
        phoneCode: this.formData.phoneCode,
      };
      AddVerifyCodeV2(say)
        .then((res) => {
          this.loading = false;
          this.initTime();
          console.log("AddVerifyCodeV2-res", res);
          this.$message({
            showClose: false,
            message: this.$t("common.sendModileCodeTips"),
            type: "success",
          });
        })
        .catch((err) => {
          console.log("AddVerifyCodeV2-err", err);
          if (err.errcode === 2102) {
            this.loading = false;
            this.$message({
              showClose: false,
              message: err.errmsg,
              type: "warning",
            });
          } else if (err.errcode === 1902) {
            this.loading = false;
            this.$message({
              showClose: false,
              message: err.errmsg,
              type: "warning",
            });
          } else {
            this.loading = false;
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
    width: 190px !important;
    margin-top: 0px !important;
    margin-left: 5px !important;
    border: none;
    border-radius: 10px !important;
  }
}
</style>