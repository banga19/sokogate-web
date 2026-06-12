<template>
  <b-container>
    <div v-title :data-title="$t('menuitems.order.detail')">
      <Breadcrumb :items="items" />
      <div id="pdfDom">
        <order-detail-steps :active="2" />
        <div>
          <el-row>
            <el-col class="col-flex">
              <el-button type="danger" v-if="orderData.status != 1301" @click="toPay">{{
                $t("common.pay")
              }}</el-button>
              <el-button type="danger" @click="toGetPdf">{{
                $t("common.exportpdf")
              }}</el-button>
              <template
                v-if="
                  orderData.status > 0 && operationByState[orderData.status]
                "
              >
                <template
                  v-for="(optKey, optIndex) in operationByState[
                    orderData.status
                  ]"
                >
                  <order-operation
                    :key="`opt-${optIndex}`"
                    :name="`order.orderOperationText.${optKey}`"
                    :icon="optMap[optKey].icon"
                    :fun="optMap[optKey].fun"
                    :ids="[id]"
                    :type="optMap[optKey].type"
                    :callback="getDetail"
                  />
                </template>
              </template>
            </el-col>
          </el-row>
        </div>
        <info-list title="order.userInfo" v-model="user" :names="names" />
        <info-list
          title="order.orderInfo"
          v-model="orderData"
          :names="names"
          :exhibit="orderExhibit"
          :to="to"
        />
        <template v-if="orderAttachList && orderAttachList.length">
          <h4 class="detail-h4">{{ $t("order.Attach list") }}</h4>
          <sui-list
            ref="orderAttachList"
            :column="orderAttachTableColumn"
            :defaultData="orderAttachList"
          />
        </template>
        <h4 class="detail-h4">{{ $t("order.Sub order list") }}</h4>
        <sui-list
          v-if="orderList.length"
          ref="orderList"
          :column="orderTableColumn"
          :defaultData="orderList"
        />
        <template v-if="orderPayList.length">
          <h4 class="detail-h4">{{ $t("order.paymentdetails") }}</h4>
          <sui-list
            ref="orderPayList"
            :column="orderPayListColumn"
            :defaultData="orderPayList"
          />
        </template>
      </div>
    </div>
  </b-container>
</template>

<script>
import OrderDetailSteps from "@/components/s-ui/order/OrderDetailSteps";
import SuiList from "@/components/s-ui/list";
import InfoList from "@/components/s-ui/order/InfoList";
import OrderOperation from "@/components/s-ui/order/OrderOperation";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { GetOrderDetail, CanceOrder, GetOrderPayList } from "@/utils/api";
import { formatDataTime } from "@/utils";

export default {
  components: {
    OrderDetailSteps,
    Breadcrumb,
    SuiList,
    OrderOperation,
    InfoList,
  },
  data() {
    return {
      title: "",
      id: 0,
      items: [
        {
          text: this.$t("index.home"),
          to: { path: "/" },
        },
        {
          text: this.$t("menuitems.order.list"),
          to: { path: "/v2/order" },
        },
        {
          text: this.$t("menuitems.order.detail"),
          active: true,
        },
      ],
      // 用户信息
      user: {},
      // 订单列表
      orderList: [],
      // 附件列表
      orderAttachList: [],
      orderPayList: [],
      // 附件列表
      orderAttachTableColumn: [
        {
          name: "type",
          label: "order.type",
          status: this.$t("order.statusText"),
        },
        {
          name: "payMethod",
          label: "order.payMethod",
        },
        {
          name: "remark",
          label: "order.remark",
        },
        {
          type: "image",
          name: "imgList",
          label: "order.imgList",
        },
        {
          name: "createAt",
          label: "order.createAt",
          formatFn: formatDataTime,
          width: 100,
        },
      ],
      // 子订单列表
      orderTableColumn: [
        {
          name: "orderNo",
          label: "order.orderno",
        },
        {
          name: "productName",
          label: "order.productName",
        },
        {
          type: "image",
          name: "productImg",
          label: "order.productImg",
        },
        {
          name: "spData",
          label: "order.spData",
        },
        {
          name: "pcs",
          label: "order.pcs",
        },
        {
          type: "price-fixed",
          name: "price",
          label: "order.price",
          width: 110,
        },
        {
          type: "price-fixed",
          name: "total",
          label: "order.total",
          width: 110,
        },
        {
          name: "createAt",
          label: "order.createAt",
          formatFn: formatDataTime,
          width: 100,
        },
      ],
      orderPayListColumn: [
        {
          name: "outTradeNo",
          label: "order.orderno",
        },
        {
          type: "price-fixed",
          name: "total",
          label: "order.total",
          width: 150,
        },

        {
          name: "payMethod",
          label: "order.payMethod",
          payMethod: this.$t("order.payMethodText"),
        },
        {
          name: "codeUrl",
          label: "order.payCodeUrl",
        },
        {
          name: "status",
          label: "order.status",
          payStatus: this.$t("order.payStatusText"),
        },
        {
          name: "createAt",
          label: "order.createAt",
          formatFn: formatDataTime,
          width: 100,
        },
      ],
      operationByState: {
        // 不同状态下，显示不同的操作按钮 当前状态: [操作后状态, 操作后状态]
        101: [1301],
        301: [401],
      },
      optMap: {
        // 操作按钮枚举
        1301: {
          icon: "el-icon-circle-close",
          type: "danger",
          fun: CanceOrder,
        },
        401: {
          icon: "el-icon-document-checked",
          // fun: GoodsReady,
        },
      },
      orderData: {},
      orderExhibit: {
        status: { type: "state" },
        total: { type: "price" },
        logisticsTotal: { type: "price" },
      },
    };
  },
  // watch: {
  //   "$route.query": function (newVal, oldVal) {
  //     // console.log(newVal, oldVal, "query");
  //     if (newVal.id !== oldVal.id && this.$route.path === "/v2/order/detail") {
  //       this.orderList = [];
  //       this.getDetail();
  //     }
  //   },
  //   "$route.path": function (newVal, oldVal) {
  //     if (newVal.id !== oldVal.id && this.$route.path === "/v2/order/detail") {
  //       this.orderList = [];
  //       this.getDetail();
  //     }
  //   },
  // },
  computed: {
    names: function () {
      return this.$t("order");
    },
    to: function () {
      return this.orderList[0] ? this.orderList[0].currencyTo : "";
    },
  },
  created() {
    this.getDetail();
    this.getOrderPayList();
  },
  methods: {
    toPay() {
      this.id = this.$route.query.id;
      this.$router.push({
        name: "payment",
        query: {
          ids: this.id,
        },
      });
    },
    getOrderPayList() {
      this.id = Number(this.$route.query.id);
      GetOrderPayList({ id: this.id })
        .then((res) => {
          // console.log("GetOrderPayList-res", res);
          const orderPayList = res.data.rows;
          // console.log(orderPayList, "orderPayList");
          this.orderPayList = orderPayList.map((v) => {
            return {
              ...v,
              outTradeNo: v.Pay.outTradeNo,
              currencyTo: v.Pay.currency,
              currencyFrom: v.Pay.currency,
              total: v.Pay.total,
              createAt: v.Pay.createAt,
              status: v.Pay.status,
              codeUrl: v.Pay.codeUrl,
              payMethod: v.Pay.payMethod,
            };
          });
        })
        .catch((err) => {
          console.log("GetOrderPayList-err", err);
        });
    },
    // 导出为pdf
    toGetPdf() {
      window.scrollTo(0, 0);
      this.getPdf(this.title);
    },
    getDetail() {
      // console.log(Number(this.$route.query.id), "id");
      this.id = Number(this.$route.query.id);
      GetOrderDetail({ id: this.id })
        .then((res) => {
          // console.log("GetOrderDetail-res:", res);
          const { orderList, orderAttachList, ...orderData } =
            res.data.OrderDetail;
          this.orderList = orderList.map((v) => {
            return {
              ...v,
              productImg: v.productImg || v.productGalleryImg,
              currencyFrom: v.currencyTo,
              currencyTo: v.currencyTo,
            };
          });
          this.orderAttachList = orderAttachList;
          this.$refs["orderAttachList"] &&
            this.$refs["orderAttachList"].setList(orderAttachList);
          // const tType = orderList.filter((v) => v.tType === 201);
          // const logisticsTotal = tType.map((v) => v.logisticsTotal);
          const {
            // 订单
            orderNo,
            cbm,
            total,
            status,
            createAt,
            updateAt,
            // 用户
            userId,
            username,
            avatar,
            // 收货地址
            consignee,
            phone,
            country,
            province,
            city,
            district,
            detail,
            email,
            // logisticsTotal,
            // 其它
            // ...others
          } = orderData;

          // this.orderData = {
          //   orderNo,
          //   total,
          //   cbm,
          //   status,
          //   createAt: formatDataTime(createAt),
          //   updateAt: formatDataTime(updateAt),
          //   consignee: `${consignee} ${phone} ${email}`,
          //   address: `${country} ${province} ${city} ${district} ${detail}`,
          //   // logisticsTotal: logisticsTotal[0],
          //   logisticsTotal: total,
          // };

          let isLogistics = orderList.find((item) => {
            return item.tType === 201;
          });
          // console.log("dadada", isLogistics, orderList);
          if (isLogistics != undefined) {
            this.orderData = {
              orderNo,
              total,
              cbm,
              status,
              createAt: formatDataTime(createAt),
              updateAt: formatDataTime(updateAt),
              consignee: `${consignee} ${phone} ${email}`,
              address: `${country} ${province} ${city} ${district} ${detail}`,
              // logisticsTotal: logisticsTotal[0],
              logisticsTotal: isLogistics.total,
            };
          } else {
            this.orderData = {
              orderNo,
              total,
              cbm,
              status,
              createAt: formatDataTime(createAt),
              updateAt: formatDataTime(updateAt),
              consignee: `${consignee} ${phone} ${email}`,
              address: `${country} ${province} ${city} ${district} ${detail}`,
              // logisticsTotal: logisticsTotal[0],
              // logisticsTotal: total,
            };
          }

          this.user = { userId, username, avatar };
          // console.log("others:", others);
          // console.log("orderData", orderData);
        })
        .catch((err) => {
          console.log("GetOrderDetail-err:", err);
        });
    },
  },
};
</script>

<style lang="scss">
.col-flex {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;

  & > * {
    margin-right: 10px;
    margin-bottom: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
}
.detail-h4 {
  color: #333;
  background: transparent;
  border: 1px solid transparent;
  padding: 12px 10px;
  font-size: 18px;
  font-weight: normal;
}
</style>