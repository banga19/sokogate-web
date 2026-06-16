<template>
  <el-container class="product-cetegort-list" v-loading="pageLoading">
    <!-- {{erMap}} -->
    <template v-if="list.length">
      <div
        class="items"
        v-for="(item, index) in list"
        :key="`starting_${index}`"
      >
        <card-large-fit
          :item="item"
          :star="true"
          :lazy="true"
          :erMap="erMap"
        />
      </div>
    </template>
    <div v-if="isEmpty" class="empty-wrap">
      <el-empty :description="$t('productList.noData')"></el-empty>
    </div>
    <el-divider v-else-if="pulldownLoading">
      <i class="el-icon-loading red"></i>
      <span class="red">{{ $t("productList.isLoadingMsg") }}</span>
    </el-divider>
    <el-divider v-else-if="noMoreData">
      <i class="el-icon-warning-outline red"></i>
      <span class="red">{{ $t("productList.noMore") }}</span>
    </el-divider>
  </el-container>
</template>



<script>
import CardLargeFit from "@/components/product/CardLargeFit";
import { GetStoreSpuList } from "@/utils/api";
import { debounce } from "@/utils";

export default {
  components: { CardLargeFit },
  data() {
    return {
      list: [],
      pageLoading: false,
      pulldownLoading: false,

      req: {
        storeId: "",
        desc: 0,
        page: 1,
        orderKey: "",
        pageSize: 30,
      },

      count: 0,
    };
  },
  computed: {
    // 汇率
    erMap() {
      return (
        this.list[0].exchangeRateList ? this.list[0].exchangeRateList : []
      ).reduce((a, v) => {
        return {
          ...a,
          [v.currencyFrom]: v.rate,
        };
      }, {});
    },
    noMoreData() {
      return this.list.length === this.count && this.count > 0;
    },
    isEmpty() {
      return this.list.length === 0 && this.req.page === 1;
    },
  },
  created() {
    this.getList(true);
  },
  watch: {
    "$route.query": function (newVal, oldVal) {
      if (
        newVal.id !== oldVal.id &&
        newVal.id !== this.req.storeId &&
        this.$route.path === "/v2/store/collections"
      ) {
        // console.log("watch", newVal, oldVal);
        debounce(this.getList(true));
      }
    },
  },
  mounted() {
    window.onscroll = () => {
      // 变量scrollTop是滚动条滚动时, 距离顶部的距离
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop; // 变量windowHeight是可视区的高度
      const windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight; // 变量scrollHeight是滚动条的总高度
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight; // 滚动条到底部的条件
      if (
        scrollTop + windowHeight > scrollHeight - 500 &&
        this.$route.path === "/v2/store/collections"
      ) {
        // 写后台加载数据的函数
        // console.log("onscroll");
        !this.isEmpty && this.getList();
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
    getList(startover = false) {
      if (
        (this.pageLoading && this.pulldownLoading) ||
        (!startover && this.noMoreData)
      ) {
        // 加载中...
        // console.log("loading:", this.pageLoading, this.pulldownLoading);
      } else {
        this.setLoading(startover, true);
        if (startover) {
          this.req.page = 1;
        } else {
          this.req.page++;
        }
        // console.log("this.$route.query.cid:", this.$route.query.cid);
        this.req.storeId = this.$route.query.id;
        // console.log("this.req:", this.req);
        GetStoreSpuList(this.req)
          .then((res) => {
            // console.log("GetSpuList", res);
            // startover 为 true 重来, 否则增加到现有的list后面
            this.list = startover
              ? res.data.rows || []
              : this.list.concat(res.data.rows);
            // 数据总条数
            this.count = res.data.count;
            // console.log(this.list, "list");
            this.setLoading(startover, false);
          })
          .catch((err) => {
            console.log("GetSpuList", err);
            this.setLoading(startover, false);
          });
      }
    },

    setLoading(startover, direct) {
      if (startover) {
        this.pageLoading = direct;
      } else {
        this.pulldownLoading = direct;
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.product-cetegort-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: -8px;

  .items {
    padding-left: 8px;
    padding-bottom: 8px;
    width: 25%;

    @include mobile {
      width: 49%;
    }
    @include tabletLand {
      width: 32,33%;
    }
    @include tabletPro {
      width: 32,33%;
    }
    @include tablet {
      width: 33%;
    }
    @include laptop {
      width: 32%;
    }
    @include desktop {
      width: 24%;
    }
    @include largeScrenn {
      width: 19%;
    }
  }
  .red {
    color: #ef2e22;
    margin-left: 10px;
  }

  .empty-wrap {
    width: 100%;
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>