<template>
  <el-container class="product-cetegort-list" v-loading="pageLoading">
    <!-- {{ pageLoading ? 'pageLoading' : 'no pageLoading' }} -->
    <!-- {{ erMap }} -->
    <template v-if="list.length">
      <div
        class="items"
        v-for="(item, index) in list"
        :key="`starting_${index}`"
      >
        <card-large-fit :item="item" :star="true" :lazy="true" :erMap="erMap" />
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
import { GetSpuList, AddSpuHistoryImgsearch, GetSpuImagesearch, GetSpuListByIds } from "@/utils/api";
import { debounce } from "@/utils";
import { get } from 'lodash'

export default {
  components: { CardLargeFit },
  data() {
    return {
      list: [],
      pageLoading: false,
      pulldownLoading: false,

      req: {
        categoryId: "",
        desc: 0,
        page: 1,
        orderKey: "",
        pageSize: 30,
        search: "",
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
    // console.log("created");
    if (this.$route.query.searchImg) {
      this.getSearchImage(decodeURIComponent(this.$route.query.searchImg))
    } else {
      this.getList(true);
    }
  },
  watch: {
    "$route.query": function (newVal, oldVal) {
      if (
        newVal.cid !== oldVal.cid &&
        newVal.cid !== this.req.categoryId &&
        this.$route.path === "/v2/product/list"
      ) {
        // console.log("watch");
        debounce(this.getList(true));
      } else if (
        newVal.search !== oldVal.search &&
        newVal.search !== this.req.search &&
        this.$route.path === "/v2/product/list"
      ) {
        // console.log(newVal, oldVal, "query");
        debounce(this.getList(true));
      } else if (
        newVal.searchImg !== oldVal.searchImg &&
        this.$route.path === "/v2/product/list"
      ) {
        debounce(this.getSearchImage(decodeURIComponent(newVal.searchImg)));
      }
    },
  },
  mounted() {
    this._onScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      if (
        scrollTop + windowHeight > scrollHeight - 500 &&
        this.$route.path === "/v2/product/list"
      ) {
        !this.isEmpty && this.getList()
      }
    }
    window.addEventListener("scroll", this._onScroll)
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this._onScroll)
  },
  methods: {
    // 子组件接收抛出的参数
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
        this.req.categoryId = this.$route.query.cid || undefined;
        this.req.search = this.$route.query.search || undefined;
        // console.log("this.req:", this.req);
        GetSpuList(this.req)
          .then((res) => {
            // console.log("GetSpuList", res);
            // startover 为 true 重来，否重增加到现有的列表后面
        const mapImage = (item) => ({
          ...item,
          img: item.img || (item.galleryList && item.galleryList[0]) || (Array.isArray(item.images) ? item.images[0] : '') || '',
        });
        this.list = startover
          ? (res.data.rows || []).map(mapImage)
          : this.list.concat(
              (res.data.rows || []).map(mapImage)
            );
            // 数据总条数
            this.count = res.data.count;
            // console.log(this.list, "list");
            this.setLoading(startover, false);
            if (this.req.page === 1 && this.req.search) {
              AddSpuHistoryImgsearch({
                search: this.req.search,
                spuId: get(res.data, 'rows[0].id'),
              })
            }
          })
          .catch((err) => {
            console.log("GetSpuList", err);
            this.setLoading(startover, false);
          });
      }
    },
    async getSearchImage(url) {
      this.setLoading(true, true)
      try {
        const searchImgRes = await GetSpuImagesearch({
          search: url,
          page: 0
        })
        const searchResult = get(searchImgRes, 'data.rows.Auctions')

        if (Array.isArray(searchResult)) {
          try {
            AddSpuHistoryImgsearch({
              search: url,
              spuId: get(searchResult, '[0].ProductId'),
            })
          } catch (error) {

          }
          const productListRes = await GetSpuListByIds({
            idList: searchResult.map(i => i.ProductId)
          })
          this.list = get(productListRes, 'data.rows', []).map((item) => ({
              ...item,
              img: item.img || (item.galleryList && item.galleryList[0]) || (Array.isArray(item.images) ? item.images[0] : '') || '',
            }))
        }
      } catch (error) {
      }
      this.setLoading(true, false)
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
    padding-left: 20px;
    padding-bottom: 8px;
    width: 25%;

    @include mobile {
      width: 49%;
    }
    @include tabletLand {
      width: 32.33%;
    }
    @include tabletPro {
      width: 32.33%;
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