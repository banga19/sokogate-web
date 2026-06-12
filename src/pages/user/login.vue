<template>
  <b-container class="page-login">
    <div v-title :data-title="$t('login.title')">
      <b-row align-v="end" class="text-center head">
        <b-col cols="12" md="auto" class="centre logo-box">
          <img class="logo" src="https://oss.sokogate.com/image/af82b848785b079390200737ab15cdff.png" alt=""
            @click="$router.push({ path: '/' })" />
        </b-col>
        <b-col cols="12" md="2" class="centre logo-box">
          {{ $t('login.title') }}&nbsp;&nbsp;<languag-switch />
        </b-col>
      </b-row>
      <div class="page-hd">
        <b-row class="login-pad">
          <b-col cols="1" md="1"></b-col>
          <b-col cols="10" md="4" class="centre">
            <b-card class="login-card" :title="$t('login.title')">
              <div class="qr-icon" v-show="!showQRCode" @click="showQR">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z" />
                </svg>
              </div>
              <transition name="el-fade-in-linear">
                <sui-form v-if="!showQRCode" ref="form" :list="formList" :defaultdata="formData" @submit="submit"
                  submitTitle="login.title" :loading="formLoading" />
              </transition>
              <transition name="el-zoom-in-bottom">
                <div class="QRBox" v-if="showQRCode" v-loading="QRLoading">
                  <div class="QRCodeImg" ref="qrCodeRef"></div>
                  <el-statistic v-if="QRExpired" @finish="onExpired" :value="QRExpired" time-indices
                    :title="$t('common.QRCodeTips')">
                  </el-statistic>
                  <div class="mask" v-if="isExpired" @click="showQR">
                    <i class="el-icon-refresh-right"></i>
                  </div>
                </div>
              </transition>
              <p class="bd-box">
                <template v-if="showQRCode">
                  <span class="toregiater" @click="hideQR">
                    {{ $t('common.backToLogin') }}
                  </span>
                </template>
                <template v-else>
                  <span class="toregiater" @click="register">
                    {{ $t('common.account') }}
                  </span>
                  <span class="toforget" @click="forgetPassword">
                    {{ $t('common.forget') }}
                  </span>
                </template>
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
import LanguagSwitch from '@/components/LanguagSwitch'
import LinkDivider from '@/components/LinkDivider'
import SuiForm from '@/components/s-ui/form'
import { Login, LoginQRCode, GetLoginCheckStatus } from '@/utils/api'
import QRCode from "qrcodejs2";

export default {
  name: 'Login',
  components: {
    LanguagSwitch,
    LinkDivider,
    SuiForm
  },
  data() {
    return {
      formList: [
        {
          type: 'phoneoremail',
          name: 'phoneoremail',
          label: 'common.mailorphone',
          rules: [
            {
              required: true,
              message: 'common.mailorphonereq',
              trigger: 'blur',
            },
          ],
        },
        {
          type: 'password',
          name: 'password',
          label: 'common.password',
          rules: [
            {
              required: true,
              message: 'common.passwordrequired',
              trigger: 'blur',
            },
            { eval: 'validatePass', trigger: 'blur' },
          ],
        },
      ],
      formData: {
        email: '',
        password: '',
      },
      formLoading: false,
      linkList: [
        { title: 'Terms Conditions' },
        { title: 'Policy for Sellers' },
        { title: 'Policy for Buyers' },
        { title: 'Shipping & Refund' },
        { title: 'Wholesale Policy' },
        { title: 'Privacy Policy' },
        { title: 'Seller Login' },
      ],
      qrcode: null,
      showQRCode: false,
      QRLoading: false,
      QRExpired: 0,
      isExpired: false,
      QRToken: '',
      timer: null,
    }
  },
  watch: {
    QRToken(val) {
      if (this.qrcode) {
        this.qrcode.clear()
        this.qrcode.makeCode(val);
      } else if (val && this.$refs.qrCodeRef) {
        this.qrcode = new QRCode(this.$refs.qrCodeRef, {
          text: val,
          width: 250,
          height: 250,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
      }
    }
  },
  methods: {
    register() {
      this.$router.push('/v2/register')
    },
    forgetPassword() {
      this.$router.push('/v2/forgetPassword')
    },
    submit(data) {
      console.log('submit:', data)
      this.formLoading = true

      if (this.$store.state.phoneoremail === 1) {
        data.mobile = data.phoneoremail
      } else if (this.$store.state.phoneoremail === 2) {
        data.email = data.phoneoremail
      }

      Login(data)
        .then(res => {
          this.loginSuccess(res)
        })
        .catch(err => {
          console.log('login-err:', err.errmsg)
          this.formLoading = false
          this.$bvToast.toast(`${err.errmsg}`, {
            toaster: 'b-toaster-top-center',
            variant: 'danger',
            appendToast: false,
            noCloseButton: true,
            autoHideDelay: 3000,
          })
        })
    },
    loginSuccess(res) {
      this.formLoading = false
      const { userInfo, token, expire } = res.data
      if (token && userInfo && userInfo.userId) {
        this.$store.commit('login', {
          user: userInfo,
          token,
          expire,
        })
        this.$bvToast.toast(this.$t('login.success'), {
          toaster: 'b-toaster-top-center',
          variant: 'success',
          appendToast: false,
          noCloseButton: true,
          autoHideDelay: 3000,
        })

        try {
          const backToRouter = localStorage.getItem('backToRouter')
          if (backToRouter) {
            this.$router.push(JSON.parse(backToRouter))
            localStorage.removeItem('backToRouter')
          } else {
            this.$router.push('/v2/product/home')
          }
        } catch (error) {
          console.log('backToRouter-error:', error)
        }
      }
    },
    showQR() {
      this.showQRCode = true
      this.QRLoading = true

      LoginQRCode()
        .then(response => {
          this.QRExpired = response.data?.Exp * 1000
          this.QRToken = response.data?.Token
          this.isExpired = false
          this.checkLoginStatus()
        })
        .catch(error => {})
        .finally(() => {
          this.QRLoading = false
        })
    },
    hideQR() {
      this.showQRCode = false
      this.onExpired()
    },
    checkLoginStatus() {
      this.timer = setTimeout(() => {
        this.handleCheckLoginStatus()
      }, 2000)
    },
    handleCheckLoginStatus() {
      GetLoginCheckStatus({
        token: this.QRToken,
      })
        .then(response => {
          this.loginSuccess(response)
        })
        .catch(error => {
          if (this.isExpired === false) {
            this.checkLoginStatus()
          }
        })
    },
    onExpired() {
      this.isExpired = true
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$mainColor: #ef2e22;

.page-login {

  .row,
  .row>* {
    padding: 0;
    margin: 0;
  }
}

.head {
  margin: 20px 15px;
}

.logo {
  width: 160px;
  cursor: pointer;

  &-box {
    height: 60px;
  }
}

.login-card {
  width: 100%;
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

  &:hover {
    .qr-icon {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
      transform: scale(1.1);
    }
  }
}

.page-hd {
  padding-top: 150px;
  background-image: url('https://oss.sokogate.com/image/49404fd02abd55e23798340c3b69f294.png');
  background-size: 100%;
  background-repeat: no-repeat;
  min-height: 545px;
}

.page-ft {
  display: inline-block;
  margin: 0 11%;
  text-align: center;
}

/* 二维码图标样式 */
.qr-icon {
  position: absolute;
  top: 5px;
  right: 0;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  /* 从左下角开始，往右上角遮住一半 */
  clip-path: polygon(0% 0%, 100% 100%, 100% 0%, 0% 0%);
}

.qr-icon svg {
  width: 30px;
  height: 30px;
  fill: $mainColor;
}

.QRBox {
  margin: 25px auto;
  text-align: center;
  position: relative;

  .QRCodeImg {
    width: 250px;
    height: 250px;
    margin: 0 auto;
  }

  .mask {
    background-color: rgba($color: #000000, $alpha: 0.6);
    color: #fff;
    font-size: 46px;
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
