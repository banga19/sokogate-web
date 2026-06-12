<template>
  <div class="InfoCard">
    <div class="box">
      <div class="title">
        <span class="icon sicon sicon-ai"></span>
        <span>{{ $t('productHome.AI sourcing Assistant') }}</span>
      </div>
    </div>

    <div class="box">
      <div class="title">
        <span class="icon sicon sicon-airplane"></span>
        <span>{{ $t('productHome.The Shipping') }}</span>
      </div>
      <div class="item">
        <span class="text space">
          <span class="name">{{ $t('productHome.Air') }}</span>
          <span class="number">7-15</span>
          <span class="days">{{ $t('productHome.days') }}</span>
        </span>
        <span class="icon sicon sicon-AirplaneInFlight"></span>
      </div>
      <div class="item">
        <span class="text space">
          <span class="name">{{ $t('productHome.Sea') }}</span>
          <span class="number">45-75</span>
          <span class="days">{{ $t('productHome.days') }}</span>
        </span>
        <span class="icon sicon sicon-boat-outline"></span>
      </div>
    </div>

    <div class="box pay">
      <div class="title">
        <span class="icon sicon sicon-card-pay"></span>
        <span>{{ $t('productHome.Local Payments') }}</span>
      </div>
      <div class="item">
        <span class="text">Visa & banks</span>
        <span class="icon ">
          <img src="https://oss.sokogate.com/static/visa.png" alt="visa" />
        </span>
      </div>
      <div class="item">
        <span class="text">mpesa</span>
        <span class="icon">
          <img src="https://oss.sokogate.com/static/mpesa.png" alt="mpesa" />
        </span>
      </div>
      <div class="item">
        <span class="text">wave</span>
        <span class="icon ">
          <img src="https://oss.sokogate.com/static/wave.jpg" alt="wave" />
        </span>
      </div>
      <div class="item">
        <span class="text">orange money</span>
        <span class="icon">
          <img src="https://oss.sokogate.com/static/orangemoney.jpg" alt="orangemoney" />
        </span>
      </div>
      <div class="item">
        <span class="text">airtel</span>
        <span class="icon">
          <img src="https://oss.sokogate.com/static/airtel.jpg" alt="airtel" />
        </span>
      </div>
      <div class="item">
        <span class="text">Tigo</span>
        <span class="icon">
          <img src="https://oss.sokogate.com/static/tigo.png" alt="Tigo" />
        </span>
      </div>
      <div class="item">
        <span class="text">ENaira</span>
        <span class="icon">
          <img :src="ENaira" alt="ENaira" />
        </span>
      </div>
      <div class="item">
        <span class="text">HALOPESA</span>
      </div>
      <div class="item">
        <span class="text">Moov</span>
        <span class="icon">
          <img :src="Moov" alt="Moov" />
        </span>
      </div>
      <div class="item">
        <span class="text">MTN</span>
        <span class="icon">
          <img :src="MTN" alt="MTN" />
        </span>
      </div>
      <div class="item">
        <span class="text">Vodacom</span>
        <span class="icon">
          <img :src="Vodacom" alt="Vodacom" />
        </span>
      </div>
      <div class="item">
        <span class="text">Zamtel</span>
        <span class="icon">
          <img :src="Zamtel" alt="Zamtel" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import ENaira from '@/assets/home/payment/ENaira.png'
import Moov from '@/assets/home/payment/Moov.png'
import MTN from '@/assets/home/payment/MTN.jpg'
import Vodacom from '@/assets/home/payment/Vodacom.png'
import Zamtel from '@/assets/home/payment/Zamtel.png'

export default {
  name: 'InfoCard',
  data() {
    return {
      ENaira,
      Moov,
      MTN,
      Vodacom,
      Zamtel
    }
  }
}
</script>

<style lang="scss" scoped>
$mainColor: #EF2E22;

.InfoCard {
  margin-top: 15px;

  .box {
    padding: 15px 12px;
    border-radius: 8px;
    background-color: #f9f9f9;

    &+.box {
      margin-top: 15px;
    }

    .title {
      font-size: 12px;
      font-weight: 900;
      font-family: system-ui;
      margin-bottom: 8px;

      .icon {
        width: 20px;
        height: 20px;
        font-size: 20px;
        margin-right: 4px;
        display: inline-block;
      }
    }

    .item {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      column-gap: 8px;
      transition: all 0.2s;

      &:hover {
        color: $mainColor;
      }

      .text {
        flex: 1;
        font-size: 14px;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

        &.space {
          display: flex;
          justify-content: space-between;
        }
      }

      .icon {
        width: 16px;
        height: 16px;
        display: inline-block;
      }
    }

    &.pay {
      .item {
        height: 2.604vw;
        align-items: center;

        &+.item {
          margin-top: .417vw;
        }

        &:hover img {
          transform: scale(1.2);
        }

        .icon {
          width: 2.083vw;
          height: 2.604vw;
          display: flex;
          align-items: center;

          img {
            width: 100%;
            transition: all 0.2s;
          }
        }
      }
    }
  }
}
</style>