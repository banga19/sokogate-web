<template>
  <div class="PayMethod" v-loading="loading">
    <div class="titleBox">
      <i class="icon el-icon-lock"></i>
      <div>
        <div class="title">{{ $t('payment.Payment') }}</div>
        <div class="desc">{{ $t('payment.Select payment method') }}</div>
      </div>
    </div>

    <div class="list">
      <el-radio v-for="item in paymentList" :key="item.name" v-model="payment" :label="item.showName || item.name"
        :title="item.showName || item.name" :disabled="item.disabled">
        <div class="radioContent">
          <div class="name">
            <template v-if="item.url">
              <img class="paymentImg" :src="item.url" :alt="item.name" />
            </template>
            <template v-else>
              {{ item.showName || item.name }}
            </template>
          </div>
          <div class="info" v-if="AllowedCurrencies[item.name]">
            <el-popover placement="bottom" width="200" trigger="hover"
              :content="AllowedCurrencies[item.name].join(', ')">
              <div class="info" slot="reference" title="">{{ AllowedCurrencies[item.name].join(', ') }}</div>
            </el-popover>
          </div>
        </div>
      </el-radio>
    </div>

    <div class="payButton" @click="onPay">
      <div class="text">{{ $t('payment.PAY NOW') }}</div>
    </div>

    <CinetpayModal ref="cinetpayModalRef" @submit="handlePay" />
    <EmailAndPhoneModal ref="EmailAndPhoneModalRef" @submit="handlePay" />
  </div>
</template>

<script>
import CinetpayModal from './CinetpayModal.vue'
import EmailAndPhoneModal from './EmailAndPhoneModal.vue'
import { usePay } from './usePay'
import usePayConfig from './usePayConfig'
import { Message } from 'element-ui'
import AllowedCurrencies from './payAllowedCurrencies'

import alipayImg from '@/assets/payment/alipay.png'
import cinetpayImg from '@/assets/payment/cinetpay.png'
import flutterwaveImg from '@/assets/payment/flutterwave.png'
import mpesaImg from '@/assets/payment/mpesa.png'
import orangeImg from '@/assets/payment/orange.png'
import pawapayImg from '@/assets/payment/pawapay.png'
import paydunyaImg from '@/assets/payment/paydunya.png'
import paystackImg from '@/assets/payment/paystack.png'
import visaImg from '@/assets/payment/visa.png'
import wechatpayImg from '@/assets/payment/wechatpay.png'

export default {
  name: 'PayMethod',
  components: {
    CinetpayModal,
    EmailAndPhoneModal
  },
  data() {
    return {
      payment: undefined,
      paymentList: [
        { name: 'alipay', url: alipayImg },
        { name: 'cinetpay', url: cinetpayImg },
        { name: 'flutterwave', url: flutterwaveImg },
        { name: 'mpesa', url: mpesaImg, disabled: true },
        { name: 'orange', url: orangeImg },
        { name: 'pawapay', url: pawapayImg },
        { name: 'paydunya', url: paydunyaImg },
        { name: 'paystack', url: paystackImg },
        { name: 'quikk', showName: 'Quikk' },
        { name: 'wechatpay', url: wechatpayImg, disabled: true },
        { name: 'wallet', showName: 'Sokogate Wallet', disabled: true },
      ]
    }
  },
  computed: {
    loading() {
      return this._usePay?.loading || false
    }
  },
  mounted() {
    const currency = this.$store.state.currency
    for (const key in AllowedCurrencies) {
      if (!Object.prototype.hasOwnProperty.call(AllowedCurrencies, key)) continue
      const paymentCurrency = AllowedCurrencies[key]
      if (Array.isArray(paymentCurrency)) {
        if (paymentCurrency.some(item => item === currency)) {
          this.payment = key
          break
        }
      }
    }
  },
  methods: {
    onPay() {
      if (this.payment === 'cinetpay') {
        this.$refs.cinetpayModalRef.open()
      } else if (this.payment === 'flutterwave') {
        this.$refs.EmailAndPhoneModalRef.open(['email', 'phone_number'])
      } else if (this.payment === 'quikk') {
        this.$refs.EmailAndPhoneModalRef.open(['phone_number'])
      } else {
        this.handlePay()
      }
    },
    async handlePay(params) {
      if (!this.payment) {
        return false
      }
      try {
        const result = await this.pay(this.payment, {
          idList: [Number(this.$route.query.ids)],
          ...params,
        })
        console.log('pay result', result)
      } catch (error) {
        Message.error(error)
      }
    }
  },
  created() {
    const usePayResult = usePay(usePayConfig)
    this._usePay = usePayResult
    this.pay = usePayResult.pay
  }
}

<style lang="scss" scoped>
.PayMethod {
  padding: 32px;
  font-family: system-ui;

  .titleBox {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    column-gap: 8px;
    margin-bottom: 24px;

    .icon {
      font-size: 24px;
    }

    .title {
      font-weight: 900;
      font-size: 20px;
    }

    .desc {
      font-size: 14px;
      color: #666;
    }
  }

  .list {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    margin-bottom: 16px;

    ::v-deep {
      .el-radio {
        height: 40px;
        display: flex;
        align-items: center;
        margin: 0;
        transition: all 0.2s;

        .el-radio__inner {
          width: 24px;
          height: 24px;

          &::after {
            width: 12px;
            height: 12px;
          }
        }

        .el-radio__label {
          flex: 1;
        }
      }
    }

    .radioContent {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .info {
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .paymentImg {
    height: 40px;
  }

  .inputBox {
    margin: 16px 0;

    ::v-deep {
      .el-input__inner {
        border-radius: 8px;
      }
    }

    .box {
      display: flex;
      margin-top: 8px;
      column-gap: 8px;
    }
  }

  .payButton {
    color: #fff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    position: sticky;
    bottom: 0;
    font-family: "Lucida Console", Consolas, "Courier New", Courier, monospace;
    background-color: #dd201c;
    background: linear-gradient(to right, #b51717 100%, #dd201c 100%);
    transition: all 0.2s;

    &:hover {
      background: linear-gradient(to right, #b51717 0%, #dd201c 100%);
    }

    .text {
      font-size: 20px;
    }

    .subText {
      font-size: 14px;
    }
  }
}

.paymentForm {
  ::v-deep {
    .el-form-item__label {
      margin: 0;
      padding: 0;
    }
  }
}
</style>