<template>
  <div class="recomm-list-by-category" ref="self">
    <br />
    <div class="title">{{ title }}</div>
    <template v-if="productCategoryList.length && categoryIdList.length">
      <el-tabs tab-position="top" v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in productCategoryList"
          :key="`${title}_recommlistbycategory_${index}`"
          :label="$t('productTitle.' + item.categoryName)"
          :name="`Selectedproducts-${index + 1}`"
        >
        </el-tab-pane>
      </el-tabs>

      <b-carousel :interval="3000" no-touch>
        <b-carousel-slide
          v-for="(item, index) in productCategoryList"
          :key="`${title}_recommlistbycategory_${index}`"
        >
          <template #img>
            <carousel
              v-if="categotyProductListMap[item.id].length"
              :autoplay="false"
              :nav="true"
              :navSpeed="700"
              :items="4"
              :margin="10"
              :loop="true"
              :dots="false"
              :touchDrag="true"
              :mouseDrag="true"
              :pullDrag="true"
              :autoWidth="false"
              :navText="['Previous', 'Next']"
              :responsiveRefreshRate="20"
              :responsive="{
                0: { items: 1, margin: 0 },
                400: { items: 2, margin: 8 },
                600: { items: 3 },
                980: { items: 4 },
                1290: { items: 5 },
              }"
            >
              <card-large-fit
                v-for="(item, index) in categotyProductListMap[item.id]"
                :key="`${title}_recommlistbycategory_carousel_card-${index}`"
                :item="item"
                :star="true"
                :erMap="erMap"
              />
            </carousel>
          </template>
        </b-carousel-slide>
      </b-carousel>
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
import { useIntersectionObserver } from "@vueuse/core";
import carousel from "vue-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { GetRecommListbyTypes } from "@/utils/api";
import CardLargeFit from "./CardLargeFit";
export default {
  components: { carousel, CardLargeFit },
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
  mounted() {
    const target = this.$refs["self"];
    // console.log("mounted-target:", target);
    const { stop } = useIntersectionObserver(
      target,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 如果在可见区域中
          console.log("如果在可见区域中:", target);
          this.getRecommListbyTypes();
          stop(); //如已在可见区域内则下次不再监听
        }
      },
      { threshold: 0 }
    ); // 当可视区域宽高为0就触发
  },
  methods: {
    getRecommListbyTypes() {
      GetRecommListbyTypes({ types: this.types }).then((res) => {
        // console.log("getRecommListbyTypes", res, res.data[0].spuList);
        this.productList = res.data[0].spuList;
        this.$emit("success");
      });
    },
  },
};
</script>

<style lang="scss">
.recomm-list-by-category {
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    color: #000;
    margin-bottom: 30px;
  }

  .owl-carousel.owl-drag .owl-item {
    width: 25%;
  }
}
</style>