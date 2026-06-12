<template>
  <div class="OrderInfo">
    <div class="title">{{ $t('payment.ORDER SUMMARY') }}</div>
    <div class="desc">{{ $t('payment.Products and Discounts') }}</div>
    <div class="item" v-for="item in productObjList" :title="item.productName">
      <span class="name">
        <SuiImage :src="item.productImg" cut="405h539" :lazy="true" />
        <span>x {{ item.pcs }}</span>
      </span>
      <span class="price">
        <SuiProductPrice :value="item.total" :form="item.currencyTo" color="unset" />
      </span>
    </div>

    <div class="item red" v-for="item in discountSteps">
      <span class="name">{{ item.name }}</span>
      <span class="price">
        <span class="symbol">-</span>
        <SuiProductPrice :value="item.discountAmount" :form="shippingObj.currencyTo" color="unset" />
      </span>
    </div>

    <div class="item">
      <span class="name">{{ $t('payment.Shipping fee') }}</span>
      <span class="price">
        <SuiProductPrice :value="shippingObj.total" :form="shippingObj.currencyTo" color="unset" />
      </span>
    </div>

    <div class="line"></div>

    <div class="item bold">
      <span class="name">{{ $t('payment.Total') }}</span>
      <span class="price">
        <SuiProductPrice :value="finalPrice" :form="shippingObj.currencyTo" color="unset" />
      </span>
    </div>
  </div>
</template>

<script>
import SuiImage from '@/components/s-ui/media/Image'
import SuiProductPrice from '@/components/product/Price.vue'
import { useAdvancedDiscount } from './useAdvancedDiscount'

export default {
  name: 'OrderInfo',
  components: {
    SuiImage,
    SuiProductPrice
  },
  props: {
    shippingObj: Object,
    productObjList: Array,
    isNewUser: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasThreeOrMoreItems() {
      let count = 0
      if (Array.isArray(this.productObjList)) {
        this.productObjList.forEach(item => {
          count += item.pcs
        })
      }
      return count >= 3
    },
    originalPrice() {
      let result = 0
      if (Array.isArray(this.productObjList)) {
        this.productObjList.forEach(item => {
          result += item.total
        })
      }
      return result
    },
    discounts() {
      return [
        { type: 'discount', name: this.$t('payment.5% discount amount'), rate: 0.95, active: true },
        { type: 'bulk', name: this.$t('payment.Bulk discount'), rate: 0.97, active: this.hasThreeOrMoreItems },
      ]
    },
    discountSteps() {
      return this._discountData.discountSteps()
    },
    totalPrice() {
      return this._discountData.totalPrice()
    },
    totalDiscount() {
      return this._discountData.totalDiscount()
    },
    finalPrice() {
      return this.totalPrice() + this.shippingObj.total
    }
  },
  created() {
    this._discountData = useAdvancedDiscount(this.originalPrice(), this.discounts())
  }
}
</script>

<style lang="scss" scoped>
.OrderInfo {
  padding: 32px;
  font-family: system-ui;

  .title {
    font-weight: 900;
    font-size: 20px;
  }

  .desc {
    font-size: 14px;
    color: #666;
  }

  .item {
    display: flex;
    align-items: center;
    margin: 16px 0;

    &.red {
      color: #ff0a0a;
    }

    &.bold {
      font-weight: bold;

      .price {
        font-weight: bold;


      }
    }

    .name {
      flex: 1;
      // color: #000;
      transition: all 0.2s;

      .sui-image {
        width: 100px;
        height: 100px;
      }
    }

    &:hover {
      color: #ff0a0a;
    }

    .price {
      font-weight: 100;

      .symbol {
        margin: 0 4px;
      }
    }
  }

  .line {
    height: 8px;
    border-bottom: 1px solid #efefef;
  }
}
</style>
