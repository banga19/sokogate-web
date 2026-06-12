<template>
  <b-container class="order">
    <div class="payBox">
      <div class="logo">
        <svg class="colorful" aria-hidden="true">
          <use xlink:href="#colorful-SokoGate" />
        </svg>
      </div>
      <div class="content" :class="{ mobile: layoutMode === 'Mobile' }">
        <div class="box">
          <OrderInfo :shippingObj="shippingObj" :productObjList="productObjList" :isNewUser="isNewUser" />
        </div>
        <div class="line"></div>
        <div class="box">
          <PayMethod />
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import OrderInfo from './components/OrderInfo.vue'
import PayMethod from './components/PayMethod.vue'
import { GetOrderListbyIds, GetOrderUserIsOnePay } from "@/utils/api"
import { get } from 'lodash'

export default {
  name: 'PaymentV2',
  components: {
    OrderInfo,
    PayMethod
  },
  data() {
    return {
      status: '',
      total: 0,
      currencyTo: '',
      shippingObj: {},
      productObjList: [],
      isNewUser: false
    }
  },
  computed: {
    layoutMode() {
      return this.$store.state.nav.layoutMode
    }
  },
  mounted() {
    if (this.$route.query.ids) {
      this.getOrderInfo(this.$route.query.ids)
    }
    this.queryTheUserIsNew()
  },
  methods: {
    async getOrderInfo(ids) {
      const idArray = ids.split(",")
      const orderIdList = idArray.map((v) => Number(v))

      const response = await GetOrderListbyIds({
        orderIdList: orderIdList,
      })
      const rows = get(response, 'data.rows')
      if (Array.isArray(rows)) {
        this.total = rows.reduce((a, v) => a + v.total, 0)
        this.currencyTo = get(rows, '[0].orderList[0].currencyTo')
        this.status = get(rows, '[0].status')
        const orderList = get(rows, '[0].orderList')
        if (Array.isArray(orderList)) {
          orderList.forEach(order => {
            if (order.productId) {
              this.productObjList.push(order)
            } else {
              this.shippingObj = order
            }
          })
        }
      }
    },
    async queryTheUserIsNew() {
      const response = await GetOrderUserIsOnePay({})
      if (get(response, 'data.orderCount') === 0) {
        this.isNewUser = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;

.order {
  max-width: 800px;
  margin: 5vh auto;
  border-radius: 32px 32px 8px 8px;
  box-shadow: 2px 1px 5px #efefef;

  .payBox {
    display: flex;
    flex-direction: column;

    .logo {
      text-align: center;
      padding: 24px;
      box-shadow: 0 5px 10px -10px #ccc;

      .colorful {
        width: 200px;
        height: 30px;
      }
    }

    .content {
      display: flex;
      align-items: stretch;

      &.mobile {
        flex-direction: column;
      }

      .box {
        flex: 1;
      }

      .line {
        margin: 32px 0;
        width: 1px;
        border-left: 1px solid #efefef;
      }
    }
  }
}
</style>