<template>
  <b-container class="my-collection-box">
    <div v-title :data-title="$t('layout.wishlist')">
      <Breadcrumb :items="items" />
      <sui-list
        ref="list"
        :column="tableColumn"
        :fun="tableFun"
        :req="tableFunReq"
        :refactor="tableDataRefactor"
        @detail="detail"
        @backflow="backflow"
        @del="del"
      />
    </div>
  </b-container>
</template>



<script>
import SuiList from "@/components/s-ui/list";
import Breadcrumb from "@/components/Breadcrumb";
import { formatDataTime, navto } from "@/utils";
import { GetSpuCollectionList, DelSpuCollection } from "@/utils/api";
export default {
  components: { SuiList, Breadcrumb },
  props: {
    max: {
      type: Number,
      value: 0,
    },
  },
  data() {
    return {
      items: [
        {
          text: this.$t("menuitems.home"),
          to: { path: "/" },
        },
        {
          text: this.$t("layout.wishlist"),
          active: true,
        },
      ],
      // 收藏列表
      tableColumn: [
        // 商品图片
        {
          type: "image",
          name: "img",
          label: "common.image",
          width: 120,
        },
        // 商品名称
        {
          name: "spuName",
          label: "content.orderList.storeName",
        },
        // 创建时间
        {
          name: "createAt",
          label: "content.orderList.createAt",
          formatFn: formatDataTime,
          width: 100,
        },
      ],
      //   收藏列表的请求接口
      tableFun: GetSpuCollectionList,
      tableFunReq: {
        page: 1,
        pageSize: this.max || 10,
      },
      // 获取res.data.rows里面sup里的数据
      tableDataRefactor: (list) => {
        // console.log("list", list);
        return list.map((v) => {
          return {
            ...v,
            img: v.spu.img,
            spuName: v.spu.spuName,
          };
        });
      },
      count: 0,
    };
  },
  mounted() {
    window.onscroll = () => {
      // 变量scrollTop是滚动条滚动时，距离顶部的距离
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop; // 变量windowHeight是可视区的高度
      const windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight; // 变量scrollHeight是滚动条的总高度
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight; // 滚动条到底部的条件
      if (
        scrollTop + windowHeight > scrollHeight - 1000 &&
        this.$route.path === "/v2/collection/collection"
      ) {
        // 写后台加载数据的函数
        // console.log("onscroll");
        // console.log(
        //   "距顶部" +
        //     scrollTop +
        //     "可视区高度" +
        //     windowHeight +
        //     "滚动条总高度" +
        //     scrollHeight
        // );
      }
    };
  },
  methods: {
    // 详情
    detail(item) {
      navto("/v2/product/detail", { id: item.spu.id });
    },
    // 删除
    del(rowData) {
      // console.log("del-rowData:", rowData);
      DelSpuCollection({
        spuId: rowData.spu.id,
      })
        .then((res) => {
          console.log("DelBanner-res:", res);
          this.$message({
            type: "success",
            message: this.$t("common.deleteSuccess"),
          });
          this.$refs["list"].getList();
        })
        .catch((err) => {
          console.log("DelBanner-err:", err);
        });
    },
    // 分页
    backflow(count) {
      this.count = count;
    },
  },
};
</script>