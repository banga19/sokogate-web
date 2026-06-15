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
    link(res){
        window.open(res)
    },
    getList() {
      GetBannerList({
        orderKey: "order_view",
        type: Number(this.type),
      })
        .then((res) => {
          console.log("GetBannerList-type-res==========:", this.type, res);
          // API now returns banners array directly as res.data
          this.list = Array.isArray(res.data) ? res.data : (res.data.rows || []);
          // 当banner数据渲染出来后发送自定义事件到子组件
          if (this.list && this.list.length) {
            this.$emit("success");
          }
        })
        .catch((err) => {
          console.log("GetBannerList-type-err:", this.type, err);
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