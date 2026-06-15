<template>
  <div class="store-carousel" v-if="list.length">
    <b-carousel
      v-if="list.length"
      :interval="0"
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
        <template #img>
          <sui-image :src="item.image" cut="1080" height="29.33vw" :style="{ height: '328px' }"  />
        </template>
      </b-carousel-slide>
    </b-carousel>

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
export default {
  components: { SuiImage },
  props: {
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
    this.getBannerList();
  },
  methods: {
    getBannerList() {
      GetBannerList({
        storeId: this.$route.query.id,
        type: Number(this.type),
      })
        .then((res) => {
          // console.log("GetBannerList", res);
          // API now returns banners array directly as res.data
          this.list = Array.isArray(res.data) ? res.data : (res.data.rows || []);
          // console.log(this.list,"list");
        })
        .catch((err) => {
          console.log("GetBannerList-err", err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.store-carousel {
  margin-bottom: 2%;
}
</style>