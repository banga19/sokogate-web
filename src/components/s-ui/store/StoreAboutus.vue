<template>
  <div class="store-about-us">
    <b-container>
      <b-row>
        <b-col cols="12" md="6">
          <sui-image
            v-if="list.length"
            :src="list[0].image"
            :lazy="true"
          ></sui-image>
        </b-col>
        <b-col cols="12" md="6">
          <div class="about-msg" v-html="item.profile"></div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SuiImage from "@/components/s-ui/media/Image";
import { GetBannerList } from "@/utils/api";
export default {
  components: { SuiImage },
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
      }).then((res) => {
        // console.log("GetBannerList", res);
        this.list = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.store-about-us {
  padding: 30px 0;
  @include mobile {
    display: flex;
    flex-direction: column;
  }
}
</style>