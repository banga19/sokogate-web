<template>
  <b-container class="page-forget-password">
    <div v-title :data-title="$t('forgetPassword.title')">
      <b-row align-v="end" class="text-center head">
        <b-col cols="12" md="auto" class="centre logo-box">
          <img
            class="logo"
            src="https://oss.sokogate.com/image/af82b848785b079390200737ab15cdff.png"
            alt=""
          />
        </b-col>
        <b-col cols="12" md="2" class="centre logo-box">
          {{ $t("forgetPassword.title") }}&nbsp;&nbsp;<languag-switch />
        </b-col>
      </b-row>
      <div class="page-hd">
        <b-row class="forget-password-pad">
          <b-col cols="1" md="1"></b-col>
          <b-col cols="10" md="4" class="centre">
            <b-card
              v-show="isShow"
              :title="$t('forgetPassword.title')"
              class="forget-password-card"
              v-loading="SengcodeLoading"
            >
              <sui-form
                ref="form"
                :list="formListToSengcode"
                :defaultdata="formDataToSengcode"
                @submit="submitToSengcode"
              />
              <p class="bd-box">
                <span class="toregiater" @click="login">
                  {{ $t("common.backToLogin") }}
                </span>
              </p>
            </b-card>
            <b-card
              v-show="!isShow"
              :title="$t('forgetPassword.title')"
              class="forget-password-card"
            >
              <sui-form
                ref="form"
                :list="formListToforget"
                :defaultdata="formDataToforget"
                @submit="submitToforget"
                :loading="formLoading"
              />
              <p class="bd-box">
                <span class="toregiater" @click="login">
                  {{ $t("common.backToLogin") }}
                </span>
                <span class="toregiater" @click="reSend">
                  {{ $t("common.resendCodeText") }}
                </span>
              </p>
            </b-card>
          </b-col>
          <b-col cols="1" md="1"></b-col>
        </b-row>
      </div>
      <div class="page-ft">
        <LinkDivider :list="linkList" />
      </div>
    </div>
  </b-container>
</template>

<script>
import LanguagSwitch from "@/components/LanguagSwitch";
import LinkDivider from "@/components/LinkDivider";
import SuiForm from "@/components/s-ui/form";
import { Forget, AddVerifyCode } from "@/utils/api";

export default {
  components: {
    LanguagSwitch,
    LinkDivider,
    SuiForm,
  },
  data() {
    return {
      isShow: true,
      SengcodeLoading: false,
      //获取验证码表单的内容
      formListToforget: [
        // 邮箱
        {
          type: "mail",
          name: "email",
          label: "common.email",
          rules: [
            {
              required: true,
              message: "common.emailrequired",
              trigger: "blur",
            },
            {
              type: "email",
              message: "common.emailFormatError",
              trigger: "blur",
            },
          ],
        },
        // 验证码
        {
          type: "input",
          name: "verifyCode",
          label: "common.verifyCode",
          rules: [
            {
              required: true,
              message: "common.verificationCodeRequired",
              trigger: "blur",
            },
          ],
        },
        // 密码
        {
          type: "password",
          name: "password",
          label: "common.password",
          rules: [
            {
              required: true,
              message: "common.passwordrequired",
              trigger: "blur",
            },
            { eval: "validatePass", trigger: "blur" },
          ],
        },
        // 确认密码
        {
          type: "password",
          name: "confirmpassword",
          label: "common.confirmpassword",
          rules: [
            {
              required: true,
              message: "common.passwordConfirmError",
              trigger: "blur",
            },
            { eval: "validatePass2", trigger: "blur" },
          ],
        },
      ],
      //获取验证码表单的参数
      formDataToforget: {
        email: "",
        verifyCode: "",
        password: "",
      },
      //忘记密码表单的内容
      formListToSengcode: [
        // 邮箱
        {
          type: "mail",
          name: "cond",
          label: "common.email",
          rules: [
            {
              required: true,
              message: "common.emailrequired",
              trigger: "blur",
            },
            {
              type: "email",
              message: "common.emailFormatError",
              trigger: "blur",
            },
          ],
        },
      ],
      //忘记密码表单的参数
      formDataToSengcode: {
        codeType: 1,
        userType: 2,
        cond: "",
      },
      linkList: [
        {
          title: "Terms Conditions",
        },
        {
          title: "Policy for Sellers",
        },
        {
          title: "Policy for Buyers",
        },
        {
          title: "Shipping & Refund",
        },
        {
          title: "Wholesale Policy",
        },
        {
          title: "Privacy Policy",
        },
        {
          title: "Seller Login",
        },
      ],
      formLoading: false,
    };
  },
  methods: {
    // 重新发送验证码
    reSend() {
      this.isShow = true;
    },
    // 去登录
    login() {
      this.$router.push("/v2/login");
    },
    // 发送验证码的表单提交
    submitToSengcode(data) {
      // console.log("submit1", data);
      this.SengcodeLoading = true;
      AddVerifyCode(data)
        .then((res) => {
          this.SengcodeLoading = false;
          console.log("AddVerifyCode-res", res);
          this.formDataToforget.email = data.cond;
          if (res.errcode === 0) {
            this.isShow = false;
          }
          this.$message({
            showClose: false,
            message: this.$t("common.sendCodeTips"),
            type: "success",
          });
        })
        .catch((err) => {
          this.SengcodeLoading = false;
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
    // 忘记密码的表单提交
    submitToforget(data) {
      this.formLoading = true;
      this.formDataToSengcode.cond = this.formDataToforget.email;
      // console.log("submit:", data);
      Forget(data)
        .then((res) => {
          this.formLoading = false;
          console.log("login-res:", res);
          this.$router.push("/v2/login");
        })
        .catch((err) => {
          console.log("login-err:", err);
          this.formLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-forget-password {
  .row,
  .row > * {
    padding: 0;
    margin: 0;
  }
}
.head {
  margin: 20px 15px;
}
.logo {
  width: 160px;

  &-box {
    height: 60px;
  }
}
.forget-password-card {
  width: 85%;
  padding: 0 15px;
  .bd-box {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    span {
      cursor: pointer;
      color: #ef2e22;
    }
  }
}
.page-hd {
  padding-top: 150px;
  background-image: url("https://oss.sokogate.com/image/49404fd02abd55e23798340c3b69f294.png");
  background-size: 100%;
  background-repeat: no-repeat;
  min-height: 545px;
}
.page-ft {
  display: inline-block;
  margin: 0 11%;
  text-align: center;
}
</style>