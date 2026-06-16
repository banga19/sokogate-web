<template>
  <div class="banner-list">
    <h4 class="title" v-if="title && title.length">{{ title }}</h4>

    <b-carousel
      v-if="list.length"
      :interval="3000"
      controls
      indicators
      label-prev=""
      label-next=""
    >
      <b-carousel-slide
        v-for="(item, index) in list"
        :key="`bannerList_${index}`"
        class="bg-carousel"
      >
        <template  #img>
        
            <div @click="link(item.jumpContent)">           
                <sui-image :src="item.image" cut="1080" height="29.33vw" />
            </div>
          
        </template>
      </b-carousel-slide>
    </b-carousel>

    <!-- <el-carousel v-if="list.length" class="bg-carousel" arrow="never">
      <el-carousel-item
        v-for="(item, index) in list"
        :key="`bannerList_${index}`"
      >
        <sui-image :src="item.image" cut="1080" height="29.33vw" />
      </el-carousel-item>
    </el-carousel> -->

    <el-skeleton
      v-else
      slot="placeholder"
      style="width: 100%; height: 29.33vw"
      :loading="true"
      animated
    >
      <template slot="template">
        <el-skeleton-item
          variant="image"
          style="width: 100%; height: 29.33vw"
        />
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import SuiImage from "@/components/s-ui/media/Image";
import { GetBannerList } from "@/utils/api";
import { normalizeBannerList } from "@/utils/banner";

// Static fallback banners (used when the API is unavailable or returns empty)
import shipping from "@/assets/home/swiper/shipping.jpg";
import manShop from "@/assets/home/swiper/manShop.png";
import womenShop1 from "@/assets/home/swiper/womenShop1,png";
import kids1 from "@/assets/home/swiper/kids1,png";
import phoneShop from "@/assets/home/swiper/phoneShop.png";
import freeShipping from "@/assets/home/swiper/freeShipping.png";

const STATIC_BANNERS = [
  { image: shipping, jumpContent: 'https://www.sokogate.com/' },
  { image: manShop, jumpContent: 'https://www.sokogate.com/' },
  { image: womenShop1, jumpContent: 'https://www.sokogate.com/' },
  { image: kids1, jumpContent: 'https://www.sokogate.com/' },
  { image: phoneShop, jumpContent: 'https://www.sokogate.com/' },
  { image: freeShipping, jumpContent: 'https://www.sokogate.com/' },
];

export default {
  components: {
    SuiImage,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    link(res) {
      window.open(res);
    },
    getList() {
      GetBannerList({
        orderKey: "order_view",
        type: Number(this.type),
      })
        .then((res) => {
          console.log("GetBannerList-type-res==========:", this.type, res);
          // Normalize banner data (handles both array and { rows } response formats)
          this.list = normalizeBannerList(res);
          // Fallback to static banners when API returns empty
          if (!this.list || !this.list.length) {
            this.list = STATIC_BANNERS;
          }
          if (this.list && this.list.length) {
            this.$emit("success");
          }
        })
        .catch((err) => {
          console.log("GetBannerList-type-err:", this.type, err);
          // Fallback to static banners when API is unavailable
          this.list = STATIC_BANNERS;
          if (this.list.length) {
            this.$emit("success");
          }
        });
    },
  },
};
</script>

<style lang="scss">
.banner-list {
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    color: #000;
    margin-bottom: 30px;
  }
}
</style>