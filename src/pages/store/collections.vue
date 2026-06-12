<template>
  <b-container class="collections-box">
    <div v-title :data-title="$t('menuitems.store.shop')">
      <Breadcrumb :items="items" />
      <storebanner-list :item="storelist" type="102"></storebanner-list>
      <store-carousel type="101"></store-carousel>
      <h3 class="store-products">{{ $t("menuitems.store.Products") }}</h3>
      <div class="sticky-wrap">
        <div v-if="categoryIdList.length" class="sticky-card">
          <storecategory-nav :item="categoryIdList"></storecategory-nav>
        </div>
        <store-list></store-list>
      </div>
    </div>
  </b-container>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import StorebannerList from "@/components/s-ui/store/StorebannerList.vue";
import StorecategoryNav from "@/components/s-ui/store/StorecategoryNav";
import StoreList from "@/components/s-ui/store/StoreList";
import StoreCarousel from "@/components/s-ui/store/StoreCarousel";
import { GetStore } from "@/utils/api";
export default {
  components: {
    Breadcrumb,
    StorebannerList,
    StorecategoryNav,
    StoreList,
    StoreCarousel,
  },
  data() {
    return {
      show: false,
      storelist: {},
      categoryIdList: [],
      items: [
        {
          text: this.$t("menuitems.home"),
          to: { path: "/" },
        },
        {
          text: this.$t("menuitems.store.shop"),
          active: true,
        },
      ],
    };
  },
  created() {
    this.getStore();
  },
  methods: {
    getStore() {
      GetStore({ id: this.$route.query.id }).then((res) => {
        // console.log("GetStore", res);
        this.storelist = res.data;
        this.categoryIdList = res.data.categoryIdList;
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.collections-box {
  .store-products {
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    line-height: 23px;
    color: #000;
    margin: 38px 0;
  }
  .sticky-wrap {
    display: flex;
  }
  .sticky-card {
    position: sticky;
    top: 20px;
    margin-right: 20px;
    align-self: flex-start;
    @include mobile {
      display: none;
    }
  }
}
</style>