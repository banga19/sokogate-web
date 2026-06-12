<template>
  <b-container>
    <div v-title :data-title="$t('menuitems.store.shop')">
      <Breadcrumb :items="items" />
      <storebanner-list :item="storelist" type="102"></storebanner-list>
      <store-aboutus type="103" :item="storelist"></store-aboutus>
    </div>
  </b-container>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import StorebannerList from "@/components/s-ui/store/StorebannerList.vue";
import StoreAboutus from "@/components/s-ui/store/StoreAboutus";
import { GetStore } from "@/utils/api";
export default {
  components: { Breadcrumb, StorebannerList, StoreAboutus },
  data() {
    return {
      storelist: {},
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
      });
    },
  },
};
</script>
