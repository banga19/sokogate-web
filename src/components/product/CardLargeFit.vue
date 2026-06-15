<template>
  <div class="card-large-fit">
    <div class="card-cover" @click="newPage">
      <b-carousel
        v-if="colorlist"
        :interval="0"
        no-touch
        no-animation
        v-model="carouselIndex"
        ref="coverbox"
      >
        <b-carousel-slide
          v-for="(item, index) in [...colorImageArray, ...item.galleryList]"
          :key="`product_detail_${index}`"
        >
          <template #img v-if="item && item.length">
            <sui-image :src="item" cut="405h539" :lazy="lazy" style="height: 40vh;"/>
          </template>
        </b-carousel-slide>
      </b-carousel>
      <sui-image :src="img" cut="405h539" :lazy="lazy" v-else />
    </div>
    <div class="card-info">
      <sui-product-price
        :value="item.minPrice"
        :erMap="erMap"
        :form="item.currency"
        color="#000"
      />
      <star v-if="star" />
    </div>
     <div class="free-shipping-box" v-if="item.skuLadderList && item.skuLadderList[0] && item.skuLadderList[0].freeShipping">
            <div class="free-shipping-msg">{{ $t("common.mailfree") }}</div>
        </div>
    <div class="card-text">
      <sui-text-trans :text="item.spuName" :trans-map="item.translationMap" />
    </div>
    <!-- <div class="card-color">
      <ul class="color-list" v-if="item.specParam.color">
        <li
          v-for="(color, index) in item.specParam.color"
          :key="`color-${color.id}-${index}`"
          class="color-item"
          :class="{
            selected: color.id === realColorId,
          }"
          @click="setColor($event, color)"
        >
          <div v-if="color.img" class="color-cover">
            <sui-image
              :src="color.img"
              width="60px"
              height="60px"
              cut="64"
              :lazy="true"
            />
          </div>
          <div>
            <div class="color-name max-one-line">
              <sui-text-trans
                :text="color.specName"
                :trans-map="color.translationMap"
              />
            </div>
            <div class="color-desc max-one-line">
              <sui-text-trans :text="color.remark" />
            </div>
          </div>
        </li>
      </ul>
    </div> -->
  </div>
</template>



<script>
import SuiImage from "@/components/s-ui/media/Image";
import SuiProductPrice from "./Price";
import Star from "./Star.vue";
import SuiTextTrans from "@/components/s-ui/info/text_trans";
export default {
  components: {
    SuiImage,
    Star,
    SuiProductPrice,
    SuiTextTrans,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    star: {
      type: Boolean,
      default: false,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    colorlist: {
      type: Boolean,
      default: false,
    },
    erMap: {
      type: Object,
    },
  },
  data() {
    return {
      colorId: 0,
      carouselIndex: 0,
      color: {},
    };
  },
  computed: {
    img() {
      if (this.item.img) return this.item.img
      if (this.item.galleryList && this.item.galleryList[0]) return this.item.galleryList[0]
      if (Array.isArray(this.item.images) && this.item.images[0]) return this.item.images[0]
      return ''
    },
    realColorId() {
      if (this.colorId) return this.colorId;
      return this.item.specParam && this.item.specParam.color && this.item.specParam.color[0]
        ? this.item.specParam.color[0].id
        : null;
    },
    colorImageArray() {
      if (this.color.img) {
        return [this.color.img];
      } else {
        return [];
      }
    },
  },
  methods: {
    setColor(e, color) {
      // console.log(e, color, "color");
      this.colorId = color.id;
      this.color = color;
      // this.$refs.coverbox.setCarouselIndex();
    },
    newPage() {
      // this.$router.push({
      //   path: "/v2/product/detail",
      //   query: { id: this.item.id, cid: this.item.categoryIdList[0] },
      // });
      window.open(
        "/v2/product/detail?id=" +
          this.item.id +
          "&cid=" +
          this.item.categoryIdList[0]
      );
    },
  },
};
</script>

<style lang="scss">
.card-large-fit {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  position: relative;
  .free-shipping-box {
    .free-shipping-msg {
      width: 75px;
      height: 18px;
      line-height: 18px;
      background-image: linear-gradient(to right, #ff6600, #ef2e22);
      border: 0;
      font-size: 10px;
      font-weight: bold;
      color: #fff;
      text-align: center;
      transition: 0.5s;
    //   position: absolute;
    //   right: 0;
    //   top: 0;
      &:hover {
        color: #fff;
        background-image: linear-gradient(to right, #ef2e22, #ef2e22);
      }
    }
  }

  .card-cover {
    display: inline-block;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .card-info {
    min-height: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
  }
  .card-text {
    min-height: 42px;
    padding-top: 6px;
    color: #767676;
    font-size: 12px;
    // 超出一行省略
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // 多行省略
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 3;
    // overflow: hidden;
  }
  .card-color {
    ul,
    li {
      margin: 0;
      padding: 0;
    }
    .color-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 8px;
      max-height: 300px;
      overflow: scroll;

      &::-webkit-scrollbar {
        width: 0px;
      }

      .color-item {
        height: 44px;
        cursor: pointer;
        border: 1px solid #eee;
        background-color: #fff;
        border-radius: 4px;
        color: #333;
        font-size: 16px;
        padding: 3px 8px 3px 3px;
        display: inline-flex;
        margin: 0 8px 8px 0;
        transition: 0.5s;

        .color-name {
          font-size: 14px;
          max-width: 180px;
        }

        .color-desc {
          font-size: 12px;
          max-width: 300px;
        }

        &:hover {
          background-color: #f8f8f8;
        }

        &.selected {
          color: #fff;
          font-weight: bold;
          border: 1px solid #ef2e22;
          background-color: #ef2e22;
        }
      }

      .color-cover {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: 2px;
        overflow: hidden;
        margin-right: 6px;
      }
    }
  }
}
</style>