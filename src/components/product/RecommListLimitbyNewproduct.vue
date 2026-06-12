<template>
  <div class="recomm-list-limit-by-newproduct">
    <br />
    <div class="title">{{ title }}</div>
    <div v-if="productList.length">
        <div class="list">
      <card-large-fit
        class="cel"
        v-for="(item, key) in productList"
        :key="`Selectedproducts-${key}`"
        :item="item"
        :star="true"
        :lazy="true"
        :erMap="erMap"
        :colorlist="true"
      />
      </div>
      <div style="text-align: center;" @click="$router.push('/v2/product/list')"><span class="seeMore">View more</span></div>
    </div>
    
    <el-skeleton
      v-else
      slot="placeholder"
      style="width: 100%; height: 26.6vw"
      :loading="true"
      animated
    >
      <template slot="template">
        <el-skeleton-item variant="image" style="width: 100%; height: 26.6vw" />
        <br />
        <el-skeleton :loading="true" animated :rows="3"> </el-skeleton>
        <br />
        <el-skeleton :loading="true" animated :rows="3"> </el-skeleton>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import { GetSpuListbyNewproduct } from "@/utils/api";
import CardLargeFit from "./CardLargeFit";
export default {
  components: { CardLargeFit },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      req: {
        categoryId: "",
        desc: 1, // 排序
        page: 1,
        orderKey: "created_at", //按创建时间来排序
        pageSize: 20,
        search: "",
      },
      productList: [],
    };
  },
  computed: {
    // 汇率
    erMap() {
      return (
        this.productList[0].exchangeRateList
          ? this.productList[0].exchangeRateList
          : []
      ).reduce((a, v) => {
        return {
          ...a,
          [v.currencyFrom]: v.rate,
        };
      }, {});
    },
  },
  created() {
    this.getRecommListbyTypes();
  },
  methods: {
    getRecommListbyTypes() {
      GetSpuListbyNewproduct(this.req).then((res) => {
        console.log("getRecommListbyTypes", res);
        this.productList = res.data.rows;
        if (this.productList && this.productList.length) {
          this.$emit("success");
        }
      });
    }
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;
.recomm-list-limit-by-newproduct {
  padding-top: 30px;
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    color: #000;
    margin-bottom: 30px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    margin-left: -8px;

    .cel {
      padding-left: 20px;
      padding-bottom: 8px;
      width: 25%;

      @include mobile {
        width: 50%;
      }
      @include tabletLand {
        width: 33.33%;
      }
      @include tabletPro {
        width: 33.33%;
      }
      @include tablet {
        width: 25%;
      }
      @include laptop {
        width: 25%;
      }
      @include desktop {
        width: 20%;
      }
      @include largeScrenn {
        width: 20%;
      }

      // @media (min-width: 400px) and (max-width: 599px) {
      //   width: 50%;
      // }
      // @media (min-width: 600px) and (max-width: 979px) {
      //   width: 33.33%;
      // }
      // @media (min-width: 980px) and (max-width: 1289px) {
      //   width: 25%;
      // }
      // @media (min-width: 1290px) {
      //   width: 20%;
      // }
    }
  }
  .seeMore{
    text-decoration: underline;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    background-color: #ff1d0f;
    width: 150px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    text-decoration: none;
    &:hover{
      color:#fff
    }
  }
}
</style>
