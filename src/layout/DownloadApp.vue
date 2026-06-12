<template>
  <div class="DownloadApp">
    <div class="title">{{ $t('general.Download the App for a sokogate') }}</div>
    <div class="title">{{ $t('general.Shopping Experience') }}</div>

    <div class="qrcodeBox">
      <div class="qrcode" ref="qrCodeRef"></div>
    </div>

    <div class="store">
      <div class="iconBox" @click="toAppStore">
        <i class="icon appStore"></i>
      </div>
      <div class="iconBox" @click="toGooglePlay">
        <i class="icon googlePlay"></i>
      </div>
    </div>

    <div class="deals">
      {{ $t('general.Explore Best Deals & Offers') }}
    </div>
    <div class="dealsInfo">
      {{ $t('general.Get upto 5% Discount on Your First Purchase').split('5%')[0] }}
      <span>5%</span>
      {{ $t('general.Get upto 5% Discount on Your First Purchase').split('5%')[1] }}
    </div>

    <div class="logo">
      <svg class="colorful" aria-hidden="true">
        <use xlink:href="#colorful-SokoGate" />
      </svg>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";

export default {
  name: 'DownloadApp',
  mounted() {
    const qrcode = new QRCode(this.$refs.qrCodeRef, {
      text: location.origin + '/appDownload.html',
      width: 105,
      height: 105,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },
  methods: {
    toAppStore() {
      window.open('https://apps.apple.com/app/sokogate/id6480171536', '_blank')
    },
    toGooglePlay() {
      window.open('https://play.google.com/store/apps/details?id=sokogate.app', '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
$mainColor: #EF2E22;

.DownloadApp {
  width: 350px;
  text-align: center;
  padding: 0 32px;

  .title {
    color: #000;
    font-family: "Lucida Console", Consolas, "Courier New", Courier, monospace;
  }

  .qrcodeBox {
    margin-top: 16px;

    .qrcode {
      width: 105px;
      height: 105px;
      margin: 0 auto;
    }
  }

  .store {
    display: flex;
    justify-content: center;
    height: 35px;
    margin: 16px 0;

    .iconBox {
      width: 120px;
    }

    .icon {
      width: 100%;
      height: 100%;
      display: inline-block;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }

    .googlePlay {
      height: 99%;
      background-image: url('~@/assets/home/Google_Play.svg');
    }

    .appStore {
      background-image: url('~@/assets/home/App_Store.svg');
    }
  }

  .deals {
    text-align: left;
    color: $mainColor;
    border-bottom: 1px solid $mainColor;
    padding-left: 54px;
    padding-bottom: 8px;
  }

  .dealsInfo {

    span {
      font-weight: 900;
    }
  }

  .logo {
    margin-top: 16px;

    .colorful {
      width: 150px;
      height: 22.5px;
    }
  }
}
</style>