<template>
  <b-container class="paySuccess">
    <div class="payBox">
      <div class="icon" :class="{ success: isSuccess }">
        <template v-if="isSuccess">
          <i class="el-icon-success"></i>
        </template>
        <template>
          <i class="el-icon-loading"></i>
        </template>
      </div>
      <div class="textContent">
        <template v-if="isSuccess">
          <div class="title">{{ $t('payment.Payment Successful') }}</div>
        </template>
        <template v-else>
          <div class="title">{{ $t('payment.Waiting for payment result') }}</div>
        </template>

        <div class="content">
          <template v-if="isSuccess">
            <div class="text">{{ $t('payment.Thank you for your purchase') }}</div>
            <div class="subText">
              {{ $t('payment.You can continue shopping') }}
            </div>
          </template>
          <template v-else>
            <div class="text">{{ $t('payment.You can stay on this page') }}</div>
            <div class="subText">
              {{ $t('payment.You can leave this page') }}
            </div>
          </template>
        </div>
      </div>

      <div class="orderDetails">
        <div class="title">{{ $t('payment.Order Details') }}</div>
        <div class="list">
          <div class="left">
            <div class="item">
              <span class="name">{{ $t('payment.Order ID') }}</span>
              <span class="value">{{ orderData.id }}</span>
            </div>
            <div class="item">
              <span class="name">{{ $t('payment.Payment Method') }}</span>
              <span class="value">{{ paymentMethod }}</span>
            </div>
          </div>
          <div class="line"></div>
          <div class="right">
            <div class="item">
              <span class="name">{{ $t('payment.Total Paid') }}</span>
              <span class="value">
                <SuiProductPrice :value="orderData.total" :form="currencyFrom" color="unset" />
              </span>
            </div>
            <div class="item">
              <span class="name">{{ $t('payment.Estimated Delivery') }}</span>
              <span class="value">{{ logisticsType[logistics] }} {{ $t('shipping.day') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="buttonWhite" v-if="!isSuccess" @click="toRePay">
        <div class="text">{{ $t('payment.Repay') }}</div>
        <div class="subText">{{ $t('payment.Click back') }}</div>
      </div>

      <div class="button" @click="toHome">
        <div class="text">{{ $t('payment.Continue Shopping') }}</div>
        <div class="subText">{{ $t('payment.Return to Home') }}</div>
      </div>
    </div>
  </b-container>
</template>
<script>
import { GetOrderDetail } from "@/utils/api"
import SuiProductPrice from '@/components/product/Price.vue'
import { get } from 'lodash'

export default {
  name: 'PaymentSuccess',
  components: {
    SuiProductPrice
  },
  data() {
    return {
      isSuccess: false,
      time: null,
      paymentMethod: '',
      orderData: {},
      logistics: null,
      currencyFrom: null,
      logisticsType: {
        201: '7-15',
        301: '45-75',
        401: '7-75',
        undefined: '-'
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      const id = Number(this.$route.query.id)
      this.queryOrderDetail(id)
      this.time = setInterval(() => {
        this.queryOrderDetail(id)
      }, 5000);
    }
    this.paymentMethod = this.$route.query.paymentMethod
  },
  beforeDestroy() {
    if (this.time) {
      clearInterval(this.time)
    }
  },
  methods: {
    async queryOrderDetail(id) {
      const res = await GetOrderDetail({ id: id })
      const status = get(res, 'data.OrderDetail.status')
      if (!this.orderData.id) {
        this.orderData = get(res, 'data.OrderDetail')
        const orderList = get(res, 'data.OrderDetail.orderList')
        this.currencyFrom = get(res, 'data.OrderDetail.orderList[0].currencyFrom')
        if (Array.isArray(orderList)) {
          orderList.forEach(order => {
            if (order.logisticsType) {
              this.logistics = order.logisticsType
            }
          })
        }
      }
      if (status === 301) {
        this.isSuccess = true
        clearInterval(this.time)
        this.time = 0
      }
    },
    toRePay() {
      this.$router.replace({
        path: '/v2/checkout/Payment',
        query: {
          ids: this.orderData.id,
        }
      })
    },
    toHome() {
      this.$router.replace({
        path: '/',
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;

.paySuccess {
  max-width: 600px;
  margin: 10vh auto;
  padding: 24px;
  border-radius: 32px 32px 8px 8px;
  box-shadow: 2px 1px 5px #efefef;

  .payBox {
    display: flex;
    flex-direction: column;

    .icon {
      font-size: 48px;
      color: #ff0a0a;
      text-align: center;

      &.success {
        color: #25caa2;
      }
    }

    .textContent {
      text-align: center;

      .title {
        font-size: 36px;
        font-weight: 900;
      }

      .subTitle {
        font-size: 24px;
      }

      .content {
        margin-bottom: 16px;

        .subText {
          color: #aaa;
          font-size: 14px;
        }
      }
    }

    .orderDetails {
      border-radius: 8px;
      border: 1px solid #efefef;
      margin-bottom: 16px;

      .title {
        padding: 8px 16px;
        border-bottom: 1px solid #efefef;
      }

      .list {
        display: flex;
        justify-content: space-between;

        .left,
        .right {
          flex: 1;
          padding: 0 8px;
        }

        .line {
          width: 1px;
          border-left: 1px solid #efefef;
        }

        .item {
          padding: 8px;
          display: flex;
          justify-content: space-between;

          &+.item {
            border-top: 1px solid #efefef;
          }
        }
      }
    }

  }


  .buttonWhite {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    margin-bottom: 16px;
    cursor: pointer;
    font-family: "Lucida Console", Consolas, "Courier New", Courier, monospace;
    background-color: #d3d3d3;
    border: 1px solid transparent;
    transition: all 0.2s;

    &:hover {
      border: 1px solid #d3d3d3;
      background-color: #fff;
    }

    .text {
      font-size: 18px;
    }

    .subText {
      font-size: 14px;
    }
  }

  .button {
    color: #fff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    font-family: "Lucida Console", Consolas, "Courier New", Courier, monospace;
    background-color: #dd201c;
    background: linear-gradient(to right, #b51717 100%, #dd201c 100%);
    transition: all 0.2s;

    &:hover {
      background: linear-gradient(to right, #b51717 0%, #dd201c 100%);
    }

    .text {
      font-size: 18px;
    }

    .subText {
      font-size: 14px;
    }
  }
}
</style>