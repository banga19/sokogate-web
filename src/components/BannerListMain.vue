<template>
  <div class="banner-list-main">
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
            <div>
                <div class="banner_content">
                    <div>
                        <h2>{{item.title}}</h2>
                        <p class="banner_text">Sokogate is an artful fusion of tradition & innovation, seamlessly connecting manufacturers, wholesalers, & discerning consumers on a global stage.</p>
                        <!-- <p class="banner_text">{{item.text}}</p> -->
                        <div class="banner_btn" @click="link(item.jumpContent)">Read More</div>
                    </div>
                    <img :src="item.image || item.image_url" class="banner_img" /> 
                </div>
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
// import SuiImage from "@/components/s-ui/media/Image";
import { GetBannerList } from "@/utils/api";
export default {
  components: {
    //SuiImage,
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
          // API now returns banners array directly as res.data
          // Normalize image_url → image for consistent template usage
          const rawList = Array.isArray(res.data) ? res.data : (res.data.rows || []);
          this.list = rawList.map((banner) => ({
            ...banner,
            image: banner.image || banner.image_url || '',
          }));
          if (this.list.length === 0) {
            // Fallback static banners when API returns empty
            this.list = [{
              image: require(`../assets/6505515-ai.png`),
              title: 'SokoGate',
              text: 'Sokogate is an artful fusion of tradition & innovation, seamlessly connecting manufacturers, wholesalers, & discerning consumers on a global stage.',
              jumpContent: 'https://www.sokogate.com/merchant-settlement'
            }];
          }
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
@use "@/style/_responsive.scss" as *;
.banner-list-main {
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    color: #000;
    margin-bottom: 30px;
  }
    .bg-carousel{
   background: #ff6c72;
    height: 385px;
    @include mobile {
      height: 270px;
    }
  }
   .banner_content{
    position: absolute;
    left: 12%;
    top: 14%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 77%;
    h2{
      font-weight: 800;
      font-size: 40px;
      color: #fff;
       @include mobile {
          font-size: 24px;
      }
    }
    .banner_text{
         font-size: 20px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 0;
        // line-height: 35px;
        margin-top: 20px;
        // max-width: 350px;
        @include mobile {
          font-size: 14px;
          line-height: 26px;
          margin-top: 14px;
        }
    }
    .banner_btn{
      width: 150px;
      height: 45px;
      font-size: 14px;
      font-weight: 800;
      color: #ff6c72;
      background-color: #fff;
      border: none;
      border-radius: 45px;
      box-shadow: 0px 5px 7px 0px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease 0s;
      cursor: pointer;
      outline: none;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 35px;

        &:hover {
          box-shadow: 0px 9px 7px rgba(0, 0, 0, 0.2);
          transform: translateY(-7px);
        
        }
        @include mobile {
            width: 100px;
            height: 35px;
            font-size: 14px;
            margin-top: 12px;
      }
    }
    .banner_img{
      width: 400px;
      @include mobile {
         width: 215px;
      }
    }
  }
  @include mobile {
    display: none;
  }
}
</style>