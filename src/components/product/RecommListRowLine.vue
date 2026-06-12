<template>
  <div class="recomm-list-row-line">
    <br />
    <div class="title">{{ title }}</div>
    <carousel
      v-if="productList.length"
      :autoplay="false"
      :nav="true"
      :navSpeed="700"
      :items="6"
      :margin="10"
      :loop="true"
      :dots="false"
      :touchDrag="true"
      :mouseDrag="true"
      :pullDrag="true"
      :autoWidth="false"
      :navText="navText"
      :responsiveRefreshRate="20"
      :responsive="{
        0: { items: 1, margin: 0 },
        400: { items: 2, margin: 8 },
        600: { items: 3 },
        980: { items: 4 },
        1290: { items: 5 },
      }"
    >
      <card-left-right
        v-for="(item, key) in productList"
        :key="`Selectedproducts-${key}`"
        :item="item"
      />
    </carousel>
    <el-skeleton
      v-else
      slot="placeholder"
      style="width: 100%; height: 6.6vw"
      :loading="true"
      animated
    >
      <template slot="template">
        <el-skeleton-item variant="image" style="width: 100%; height: 6.6vw" />
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import carousel from "vue-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { GetRecommListbyTypes } from "@/utils/api";
import CardLeftRight from "./CardLeftRight";
export default {
  components: { carousel, CardLeftRight },
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
      productList: [],
      navText: [
        '<i class="el-icon-arrow-left"></i>',
        '<i class="el-icon-arrow-right"></i>',
      ],
    };
  },
  created() {
    this.getRecommListbyTypes();
  },
  methods: {
    getRecommListbyTypes() {
      GetRecommListbyTypes({ types: this.types }).then((res) => {
        // console.log("getRecommListbyTypes", res);
        this.productList = res.data[0].spuList;
        if(this.productList && this.productList.length){
          this.$emit("success");
        }
      });
    },
  },
};
</script>

<style lang="scss">
.recomm-list-row-line {
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    color: #000;
    margin-bottom: 30px;
  }

  .owl-carousel {
    .owl-drag .owl-item {
      width: 25%;
    }
    .owl-nav {
      .owl-prev {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 0 100px 100px 0;
        position: absolute;
        top: 15%;
        left: -4px;
      }
      .owl-next {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 100px 0 0 100px;
        position: absolute;
        top: 15%;
        right: -4px;
      }
    }
  }
}
</style>