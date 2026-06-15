<template>
  <div class="card-left-right" @click="newPage">
    <div class="card-cover">
      <sui-image
        :src="item.img"
        width="60px"
        height="60px"
        cut="64"
        :lazy="true"
      />
    </div>
    <div class="card-text">
      <!-- {{ item.spuName }} -->
      <sui-text-trans :text="item.spuName" :trans-map="item.translationMap" />
    </div>
  </div>
</template>



<script>
import SuiImage from "@/components/s-ui/media/Image";
import SuiTextTrans from "@/components/s-ui/info/text_trans";

export default {
  components: {
    SuiImage,
    SuiTextTrans,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    img() {
      try {
        const src = this.item.img || (this.item.galleryList && this.item.galleryList[0]) || (Array.isArray(this.item.images) ? this.item.images[0] : '') || ''
        return src ? (src + '?x-oss-process=style/thumbnail/60x60') : ''
      } catch (e) { return '' }
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



<style lang="scss" scoped>
.card-left-right {
  cursor: pointer;
  display: flex;

  .card-cover {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    margin-right: 12px;
  }

  .card-text {
    padding-top: 6px;
    color: #767676;
    font-size: 12px;
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
}
</style>