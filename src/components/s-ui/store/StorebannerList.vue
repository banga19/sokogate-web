<template>
  <div class="banner-list-box">
    <sui-image
      v-if="items.length"
      :src="items[0].image"
      :lazy="true"
      :style="{ height: '108px' }"
    ></sui-image>
    <div class="store-item">
      <h5 class="store-name">{{ item.storeName }}</h5>
    </div>
    <div class="store-about">
      <span
        @click="
          $router.push({
            path: '/v2/store/collections',
            query: { id: item.id },
          })
        "
      >
        Home
      </span>
      <span
        @click="
          $router.push({
            path: '/v2/store/about',
            query: { id: item.id },
          })
        "
      >
        About us
      </span>
    </div>
  </div>
</template>


<script>
import SuiImage from "@/components/s-ui/media/Image";
import { GetBannerList } from "@/utils/api";
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
    },
  },
  components: { SuiImage },
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.getBannerList();
  },
  methods: {
    getBannerList() {
      GetBannerList({
        storeId: this.$route.query.id,
        type: Number(this.type),
      }).then((res) => {
        // console.log("GetBannerList", res);
        // API now returns banners array directly as res.data
        // Normalize image_url → image for consistent template usage
        const rawData = res && res.data;
        const rawItems = Array.isArray(rawData) ? rawData : (rawData && rawData.rows) || [];
        this.items = rawItems.map((banner) => ({
          ...banner,
          image: banner.image || banner.image_url || '',
        }));
        // console.log(this.items, "items");
      }).catch((err) => {
        console.log("GetBannerList-err", err);
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.banner-list-box {
  width: 100%;
  margin-bottom: 5px;
  position: relative;
  .store-item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .store-name {
      margin: 0;
      font-weight: 500;
      font-size: 30px;
      color: #000;
      @include mobile {
        font-size: 20px;
      }
    }
    @include mobile {
      left: 9%;
      transform: translate(-9%, -50%);
    }
  }
  .store-about {
    position: absolute;
    right: 9%;
    top: 50%;
    transform: translateY(-50%);
    span {
      cursor: pointer;
      width: auto;
      height: 36px;
      background: #ffffff;
      border-radius: 20px;
      margin-left: 15px;
      padding: 5px 10px;
      color: #000;
    }
  }
}
</style>