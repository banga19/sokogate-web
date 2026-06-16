<template #img>
  <div class="recomm-list-by-category">
    <br />
    <div class="title">{{ title }}</div>
    <template v-if="productCategoryList.length && categoryIdList.length">
      <el-tabs tab-position="top" v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in productCategoryList"
          :key="`maylike_${index}`"
          :label="$t('productTitle.' + item.categoryName)"
          :name="`Selectedproducts-${index + 1}`"
        >
        </el-tab-pane>
      </el-tabs>
      
      <div>
        <div v-for="(item, index) in productCategoryList" :key="`maylike_carousel_${index}`">
          <div v-if="activeIndex == index">
            <div v-if="categotyProductListMap[item.id].length" class="list">
              <card-large-fit
                class="cel"
                v-for="(item, key) in categotyProductListMap[item.id]"
                :key="`Selectedproducts-${key}`"
                :item="item"
                :star="true"
                :erMap="erMap"
              />
            </div>
            <div style="margin-bottom:20px;text-align: center;" @click="$router.push('/v2/product/list')"><span class="seeMore">View more</span></div>
          </div>
          
        </div>
      </div>
      <!-- <b-carousel :interval="3000" no-touch :value="activeIndex">
        <b-carousel-slide
          v-for="(item, index) in productCategoryList"
          :key="`maylike_carousel_${index}`"
        >
          <template #img>
            <div v-if="categotyProductListMap[item.id].length" class="list">
              <card-large-fit
                class="cel"
                v-for="(item, key) in categotyProductListMap[item.id]"
                :key="`Selectedproducts-${key}`"
                :item="item"
                :star="true"
                :erMap="erMap"
              />
            </div>
            <div style="margin-bottom:20px" @click="$router.push('/v2/product/list')"><span class="seeMore">See more</span></div>
          </template>
        </b-carousel-slide>
      </b-carousel> -->
    </template>
    <el-skeleton
      v-else
      slot="placeholder"
      style="width: 100%; height: 29.33vw"
      :loading="true"
      animated
    >
      <template slot="template">
        <div>
          <el-skeleton-item variant="p" style="width: 40%" />
        </div>
        <el-skeleton-item variant="p" style="width: 60%" />
        <el-skeleton-item variant="image" style="width: 100%; height: 25vw" />
      </template>
    </el-skeleton>
  </div>
</template>


<script>
import { GetRecommListbyTypes } from "@/utils/api";
import CardLargeFit from "./CardLargeFit";
export default {
  components: { CardLargeFit },
  props: {
    title: {
      type: String,
      default: "",
    },
    types: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeName: "Selectedproducts-1",
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
    activeIndex() {
      return Number(this.activeName.replace("Selectedproducts-", "")) - 1;
    },
    // 分类的id
    categoryIdList() {
      if (this.$store.state.menu && this.$store.state.menu.length) {
        return this.$store.state.menu.map((v) => v.id);
      } else {
        return [];
      }
    },
    // 当前商品的第一级id
    curRootCategoryIdList() {
      if (this.categoryIdList.length && this.productList.length) {
        // 得到商品的第一级Id然后去重
        return this.productList
          .map((v) => v.categoryIdList[0])
          .reduce((pre, cur) => {
            if (!pre.includes(cur)) {
              return pre.concat(cur);
            } else {
              return pre;
            }
          }, []);
      } else {
        return [];
      }
    },
    // 通过分类与商品id相比较得到分类list展示
    productCategoryList() {
      if (
        this.$store.state.menu &&
        this.$store.state.menu.length &&
        this.curRootCategoryIdList
      ) {
        return this.$store.state.menu.filter((v) =>
          this.curRootCategoryIdList.includes(v.id)
        );
      } else {
        return [];
      }
    },
    // 通过分类id得到相应的商品list
    categotyProductListMap() {
      if (this.curRootCategoryIdList.length && this.productList.length) {
        return this.curRootCategoryIdList.reduce((map, key) => {
          return {
            ...map,
            [key]: this.productList.filter((v) => v.categoryIdList[0] == key).slice(0, 12),
          };
        }, {});
      } else {
        return [];
      }
    },
  },
  created() {
    this.getRecommListbyTypes();
  },
  methods: {
    getRecommListbyTypes() {
      GetRecommListbyTypes({ types: this.types }).then((res) => {
        // console.log("getRecommListbyTypes", res);
        this.productList = res.data[0].spuList;
        this.$emit("success");
      });
    },
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;
.recomm-list-by-category {
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
      padding-left: 8px;
      padding-bottom: 8px;
      width: 25%;

      @include mobile {
        width: 50%;
      }
      @include tabletLand {
        width: 33,33%;
      }
      @include tabletPro {
        width: 33,33%;
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