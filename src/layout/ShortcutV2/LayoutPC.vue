<template>
  <div class="shortcut sticky">
    <div class="left">
      <a href="/">
        <img class="logo" src="@/assets/logo.svg" alt="Sokogate" />
      </a>
    </div>
    <div class="center">
      <div class="searchBox">
        <el-input :placeholder="$t('index.search')" size="medium" v-model="searchText"
          @keyup.enter.native="handleSearch">
          <template #suffix>
            <div class="searchSuffix">
              <el-upload action="" accept="image/*" :show-file-list="false" :on-success="handleUploadSuccess"
                :before-upload="beforeUpload" :http-request="handleUpload">
                <el-button class="searchIcon" type="text" icon="el-icon-picture-outline" circle
                  @click="handleSearch"></el-button>
              </el-upload>
              <el-button class="searchIcon" type="text" icon="el-icon-search" circle @click="handleSearch"></el-button>
            </div>
          </template>
        </el-input>
      </div>
    </div>
    <div class="right">
      <div>
        <el-popover placement="bottom" trigger="hover">
          <DownloadApp />
          <div class="downloadApp" slot="reference">
            <i class="el-icon-mobile-phone"></i>
            {{ $t('general.Download Our App') }}
          </div>
        </el-popover>
      </div>
      <div class="margin"></div>
      <div class="textButton" @click="$router.push({ name: 'guarantee' })" :title="$t('general.guarantee')">
        <i class="icon sicon sicon-delivery"></i>
      </div>
      <div class="margin"></div>
      <div class="textButton" @click="$router.push({ name: 'delivery' })" :title="$t('general.delivery')">
        <i class="icon sicon sicon-guarantee"></i>
      </div>
      <div class="margin"></div>
      <div class="textButton" @click="createMyShop" :title="$t('general.createmyshop')">
        <i class="icon sicon sicon-store"></i>
      </div>
      <div class="margin"></div>
      <div class="cartIcon" @click="$utils.navto('/v2/shopping-cart')">
        <div class="cart-badge">
          <i class="sokogate icon-a-Group202" />
          <span v-if="cartCount" class="badge-count">{{ cartCount }}</span>
        </div>
      </div>
      <div class="margin"></div>
      <div class="textButton">
        <el-dropdown v-if="currentUser" class="shortcut-hd-btn" trigger="click" @command="userCommand">
          <div class="flex">
            <i class="icon sicon sicon-user"></i>
            <span>
              {{ currentUser.email || currentUser.mobile }}
            </span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="authentication">
              {{ $t("authentication") }}
            </el-dropdown-item>
            <el-dropdown-item command="verifymailbox">
              {{ $t("bindemail") }}
            </el-dropdown-item>
            <el-dropdown-item command="bindmobilenumber">
              {{ $t("bindmobile") }}
            </el-dropdown-item>
            <el-dropdown-item command="orders">
              {{ $t("layout.orders") }}
            </el-dropdown-item>
            <el-dropdown-item command="wishlist">
              {{ $t("layout.wishlist") }}
            </el-dropdown-item>
            <el-dropdown-item command="my-sokogate">
              {{ $t("layout.my-sokogate") }}
            </el-dropdown-item>
            <el-dropdown-item command="exit">
              {{ $t("login.out") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-else class="shortcut-hd-btn" @click="$router.push('/v2/login')">
          <i class="icon sicon sicon-user"></i>
          {{ $t("general.registerorsignin") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetCartList, UploadFileToOSS } from '@/utils/api'
import ZhLanguage from '@/locale/zh.json'
import { Message } from 'element-ui'
import { get } from 'lodash'
import { getOSSImageFullUrl } from '@/utils/OSS'

const DownloadApp = () => import('../DownloadApp.vue')

export default {
  name: 'LayoutPC',
  components: {
    DownloadApp
  },
  data() {
    return {
      searchText: '',
      uploadLoading: null,
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user
    },
    cartCount() {
      return this.$store.state.cartCount
    }
  },
  mounted() {
    this.initLocalStorage()
    this.gpsCountry()
    if (this.$route.query.search) {
      this.searchText = this.$route.query.search
    }
    this.$store.dispatch('fetchMenus').catch(() => {})
  },
  methods: {
    handleSearch() {
      if (this.searchText) {
        this.$utils.navto('/v2/product/list', {
          search: `${this.searchText}`,
        })
      }
    },
    createMyShop() {
      window.open('HTTPS://vendor.sokogate.com/v2/register')
    },
    userCommand(command) {
      if (command === 'exit') {
        this.loginoutConfirm()
      } else if (command === 'authentication') {
        this.$router.push('/v2/authentication/mobileAuthentication')
      } else if (command === 'verifymailbox') {
        this.$store.commit('setemailVisible', true)
      } else if (command === 'bindmobilenumber') {
        this.$store.commit('setmobileVisible', true)
      } else if (command === 'orders') {
        this.$router.push('/v2/order')
      } else if (command === 'wishlist') {
        this.$router.push('/v2/collection/collection')
      } else if (command === 'my-sokogate') {
        this.$router.push({ name: 'Personal Center' })
      }
    },
    initLocalStorage() {
      const token = localStorage.getItem('auth_token')
      const currentUser = localStorage.getItem('currentUser')
      const auth_token_expire = localStorage.getItem('auth_token_expire')
      const user = currentUser ? JSON.parse(currentUser) : null

      const currency = localStorage.getItem('currency')

      if (currency) {
        this.$store.commit('setCurrency', currency)
      }

      const language = localStorage.getItem('language')

      if (language) {
        this.$store.commit('setLanguage', language)
      }
      if (
        user &&
        user.userId &&
        token &&
        auth_token_expire &&
        auth_token_expire !== 'undefined' &&
        auth_token_expire !== '0'
      ) {
        this.$store.commit('login', {
          user,
          token,
          expire: auth_token_expire,
        })
        this.$nextTick(() => this.getList())
      } else {
        this.$store.commit('loginout')
      }
    },
    getList() {
      if (
        this.$store.getters.authTokenIsValid &&
        !this.$store.state.cartActivated
      ) {
        GetCartList({})
          .then(res => {
            this.$store.commit(
              'cartCountSet',
              get(res, 'data.rows.length')
            )
          })
          .catch(() => {
            this.$store.commit('cartCountSet', 0)
          })
      }
    },
    gpsCountry() {
      let country_en = localStorage.getItem('country_en')
      if (country_en) {
        this.$store.commit('nav/setCountryEnName', country_en)
        this.$store.commit(
          'nav/setCountry',
          this.$t('categorys.' + country_en)
        )
        return
      }

      const data = {
        key: 'RWMBZ-AZHLJ-GIUFW-KLDDX-PC6IO-U7FIG',
      }
      const url = 'HTTPS://apis.map.qq.com/ws/location/v1/ip'
      data.output = 'jsonp'
      this.$jsonp(url, data)
        .then(res => {
          let countryEn = this.getObjectKey(
            ZhLanguage.categorys,
            get(res, 'result.ad_info.nation')
          )

          if (!countryEn) {
            throw new Error(res)
          }

          localStorage.setItem('country_en', countryEn)
          this.$store.commit('nav/setCountryEnName', countryEn)
          this.$store.commit(
            'nav/setCountry',
            this.$t('categorys.' + countryEn)
          )
        })
        .catch(error => {
          console.log('Failed to get geolocation info')
          throw new Error(error)
        })
        .catch(() => {
          this.$store.commit('nav/setCountryEnName', 'United States')
          this.$store.commit(
            'nav/setCountry',
            this.$t('categorys.' + 'United States')
          )
        })
    },
    getObjectKey(object, value) {
      return Object.keys(object).find(key => object[key] == value)
    },
    loginoutConfirm() {
      this.$bvModal
        .msgBoxConfirm(this.$t('login.out-confirm'), {
          title: this.$t('api.message'),
          okTitle: this.$t('modal.ok'),
          cancelTitle: this.$t('modal.cancel'),
        })
        .then(value => {
          if (value) {
            this.handleLoginout()
          }
        })
        .catch(err => {
          console.log('catch-err:', err)
        })
    },
    handleLoginout() {
      this.$store.commit('loginout')
      this.$router.go(0)
    },
    beforeUpload(file) {
      if (file.type.indexOf('image/') !== 0) {
        Message.error(this.$t('upload.limitOnlyImage'))
        throw new Error('只能uploadimage/picture')
      }
      if (file.size / 1024 / 1024 > 4) {
        Message.error(this.$t('upload.limitFileSize') + ': 4MB')
        throw new Error('image/picture过大')
      }
      return this.checkImageResolution(file).then(result => {
        if (!result.isValid) {
          if (result.width <= 100 || result.height <= 100) {
            Message.error(
              this.$t('upload.imageResolutionToSmall') + ': < 100px'
            )
          } else {
            Message.error(
              this.$t('upload.imageResolutionToLarge') + ': > 4096px'
            )
          }
          throw new Error('image/picture分辨率不符合')
        }
        this.uploadLoading = this.$loading({
          lock: true,
          text: this.$t('upload.uploading'),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
      })
    },
    async handleUpload(params) {
      try {
        const response = await UploadFileToOSS(params.file, 'searchImg/')
        return getOSSImageFullUrl(response)
      } finally {
        if (this.uploadLoading) {
          this.uploadLoading.close()
        }
      }
    },
    handleUploadSuccess(url) {
      this.$utils.navto('/v2/product/list', {
        searchImg: encodeURIComponent(url),
      })
    },
    checkImageResolution(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = function (e) {
          const img = new Image()

          img.onload = function () {
            const width = img.naturalWidth
            const height = img.naturalHeight

            const isValid =
              width >= 100 &&
              width <= 4096 &&
              height >= 100 &&
              height <= 4096

            resolve({
              isValid,
              width,
              height,
            })
          }

          img.onerror = function () {
            reject(new Error('image/picture加载failed'))
          }

          img.src = e.target.result
        }

        reader.onerror = function () {
          reject(new Error('file读取failed'))
        }

        reader.readAsDataURL(file)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$mainColor: #EF2E22;

.shortcut {
  height: 60px;
  padding: 0 25px;
  display: flex;
  background-color: #000;

  &.sticky {
    position: sticky;
    top: 0;
    z-index: 200;
  }

  .icon {
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .margin {
    margin: 0 8px;
  }

  .textButton {
    cursor: pointer;
    color: #fff;
    transition: all 0.2s;

    &:hover {
      color: $mainColor;
      filter: invert(48%) sepia(77%) saturate(7500%) hue-rotate(350deg) brightness(94%) contrast(92%);
    }

    .icon {
      font-size: 22px;
    }

    .flex {
      display: flex;
      align-items: center;
      column-gap: 4px;
    }

    ::v-deep {
      .el-dropdown {
        color: #fff;
      }
    }
  }

  .left {
    width: 220px;
    height: 100%;
    display: flex;
    align-items: center;

    .logo {
      width: 170px;
      height: 40px;
      cursor: pointer;
      object-fit: contain;
    }

  }

  .center {
    flex: 1;
    display: flex;
    align-items: center;

    .searchBox {
      width: 90%;

      .searchSuffix {
        display: flex;
      }

      .searchIcon {
        color: #212529;
        padding: 7px;
        font-size: 20px;
        transition: all 0.2s;

        &:hover {
          color: $mainColor;
        }
      }
    }
  }

  .right {
    min-width: 25%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 8px;

    .select {
      display: flex;
      align-items: center;
      column-gap: 8px;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;

      &:hover {
        color: $mainColor;
      }

      .avatarBox {
        width: 32px;
        height: 32px;
        border-radius: 50%;

        .sui-flag {
          width: 32px;
          margin: 0;
        }
      }

      .arrowDown {
        width: 8px;
        height: 8px;
        background-image: url('~@/assets/home/arrow-down.svg');
      }
    }

  }

  .downloadApp {
    background-color: $mainColor;
    color: #fff;
    padding: 8px;
    border-radius: 8px;
    font-size: 14px;

    &:hover {
      background: #aaa;
    }
  }

  .cartIcon {
    position: relative;
    cursor: pointer;

    .cart-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #fafbfd;
      color: #212529;
      transition: all 0.2s;

      &:hover {
        color: #fff;
        background-color: #6c757d;
      }

      .sokogate {
        font-size: 18px;
      }

      .badge-count {
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 18px;
        height: 18px;
        line-height: 18px;
        padding: 0 5px;
        border-radius: 9px;
        background-color: #dc3545;
        color: #fff;
        font-size: 11px;
        text-align: center;
        font-weight: bold;
      }
    }
  }
}
</style>