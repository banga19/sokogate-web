<template>
  <el-card class="page-card">
    <sui-list
      ref="list"
      :column="tableColumn"
      :fun="tableFun"
      :req="tableFunReq"
      :refactor="tableDataRefactor"
      @detail="detail"
      @pay="pay"
      @backflow="backflow"
    />
  </el-card>
</template>
<script>
// Order的列表
import SuiList from "@/components/s-ui/list";
import { GetOrderListbyStatus } from "@/utils/api";
import { formatDataTime, navto } from "@/utils";

export default {
  components: { SuiList },
  props: {
    max: {
      type: Number,
      value: 0,
    },
  },
  data() {
    return {
      tableColumn: [
        // 图片
        {
          type: "image",
          name: "productImg",
          label: "common.image",
        },
        // 店铺名称
        {
          name: "storeName",
          label: "content.orderList.storeName",
        },
        // 单价
        {
          type: "price-fixed",
          name: "total",
          label: "content.orderList.totalprice",
          width: 110,
        },
        // {
        //   name: "price",
        //   label: "content.orderList.unitprice",
        //   formatFn: formatToDecimal,
        //   width: 100,
        // },
        // 数量
        {
          name: "pcs",
          label: "content.orderList.quantity",
          width: 100,
        },
        // 规格
        {
          name: "spData",
          label: "order.spData",
        },
        // 状态
        {
          name: "status",
          label: "content.orderList.transaction",
          status: this.$t("order.statusText"),
        },
        // 创建时间
        {
          name: "createAt",
          label: "content.orderList.createAt",
          formatFn: formatDataTime,
          width: 100,
        },
      ],
      // 列表的请求接口
      tableFun: GetOrderListbyStatus,
      // 列表的默认参数
      tableFunReq: {
        orderKey: "",
        status: 0,
        storeId: "",
        userId: "",
        pageSize: this.max || 10,
      },
      // 获取res.data.rows里面sup里的数据
      tableDataRefactor: (list) => {
        // console.log("list", list);
        return list.map((v) => {
          return {
            ...v,
            // productImg: v.orderList[0].productImg,
            productImg: v.orderList.map((c) => c.productImg),
            price: v.orderList[0].price,
            pcs: v.orderList[0].pcs,
            spData: v.orderList[0].spData,
            currencyFrom: v.orderList[0].currencyTo,
            currencyTo: v.orderList[0].currencyTo,
          };
        });
      },
      count: 0,
    };
  },
  methods: {
    // 分页
    backflow(count) {
      this.count = count;
    },
    // 详情
    detail(item) {
      // console.log("navtodetail:", item);
      navto("/v2/order/detail", { id: item.id });
    },
    pay(item) {
      // console.log("pay", item, item.id);
      navto("/v2/checkout/payment", { ids: item.id });
    },
  },
};
</script>

<style lang="scss">
.hd {
  &-row {
    color: #333;
    font-weight: normal;
  }
}
.bd {
  &-row {
    text-align: center;
  }
}
.page-card {
  .el-icon-upload {
    padding-top: 30px;
  }
}
</style>